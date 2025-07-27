import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, insertProcessingLogSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import sharp from "sharp";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// Middleware to verify JWT token
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
      
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          isPro: user.isPro 
        }, 
        token 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid input data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const loginData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(loginData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(loginData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
      
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          isPro: user.isPro 
        }, 
        token 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid input data" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        isPro: user.isPro 
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Image processing routes
  app.post("/api/images/resize", upload.single('image'), authenticateToken, async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check file size limits
      const fileSizeMB = req.file.size / (1024 * 1024);
      const maxSize = user.isPro ? 100 : 10;
      
      if (fileSizeMB > maxSize) {
        return res.status(400).json({ 
          message: `File size exceeds ${maxSize}MB limit for ${user.isPro ? 'Pro' : 'Free'} plan` 
        });
      }

      const { width, height, quality } = req.body;
      const startTime = Date.now();

      // Process image with Sharp
      let image = sharp(req.file.buffer);
      
      if (width || height) {
        image = image.resize(parseInt(width), parseInt(height), {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      if (quality) {
        image = image.jpeg({ quality: parseInt(quality) });
      }

      const processedBuffer = await image.toBuffer();
      const processingTime = Date.now() - startTime;

      // Log the processing
      await storage.createProcessingLog({
        userId: user.id,
        toolType: 'resize',
        inputFormat: req.file.mimetype,
        outputFormat: 'image/jpeg',
        fileSizeMB: fileSizeMB.toString(),
        processingTimeMs: processingTime,
      });

      res.set({
        'Content-Type': 'image/jpeg',
        'Content-Disposition': 'attachment; filename="resized-image.jpg"'
      });
      res.send(processedBuffer);
    } catch (error) {
      console.error('Resize error:', error);
      res.status(500).json({ message: "Image processing failed" });
    }
  });

  app.post("/api/images/convert", upload.single('image'), authenticateToken, async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const fileSizeMB = req.file.size / (1024 * 1024);
      const maxSize = user.isPro ? 100 : 10;
      
      if (fileSizeMB > maxSize) {
        return res.status(400).json({ 
          message: `File size exceeds ${maxSize}MB limit for ${user.isPro ? 'Pro' : 'Free'} plan` 
        });
      }

      const { format, quality } = req.body;
      const startTime = Date.now();

      let image = sharp(req.file.buffer);
      let outputFormat = format || 'jpeg';
      let contentType = `image/${outputFormat}`;

      switch (outputFormat) {
        case 'jpeg':
        case 'jpg':
          image = image.jpeg({ quality: parseInt(quality) || 80 });
          contentType = 'image/jpeg';
          break;
        case 'png':
          image = image.png();
          contentType = 'image/png';
          break;
        case 'webp':
          image = image.webp({ quality: parseInt(quality) || 80 });
          contentType = 'image/webp';
          break;
        default:
          return res.status(400).json({ message: "Unsupported format" });
      }

      const processedBuffer = await image.toBuffer();
      const processingTime = Date.now() - startTime;

      // Log the processing
      await storage.createProcessingLog({
        userId: user.id,
        toolType: 'convert',
        inputFormat: req.file.mimetype,
        outputFormat: contentType,
        fileSizeMB: fileSizeMB.toString(),
        processingTimeMs: processingTime,
      });

      res.set({
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="converted-image.${outputFormat}"`
      });
      res.send(processedBuffer);
    } catch (error) {
      console.error('Convert error:', error);
      res.status(500).json({ message: "Image conversion failed" });
    }
  });

  app.post("/api/images/compress", upload.single('image'), authenticateToken, async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const fileSizeMB = req.file.size / (1024 * 1024);
      const maxSize = user.isPro ? 100 : 10;
      
      if (fileSizeMB > maxSize) {
        return res.status(400).json({ 
          message: `File size exceeds ${maxSize}MB limit for ${user.isPro ? 'Pro' : 'Free'} plan` 
        });
      }

      const { quality } = req.body;
      const startTime = Date.now();

      let image = sharp(req.file.buffer);
      const compressionQuality = parseInt(quality) || 60;

      // Determine output format based on input
      if (req.file.mimetype === 'image/png') {
        image = image.png({ quality: compressionQuality });
      } else {
        image = image.jpeg({ quality: compressionQuality });
      }

      const processedBuffer = await image.toBuffer();
      const processingTime = Date.now() - startTime;

      // Log the processing
      await storage.createProcessingLog({
        userId: user.id,
        toolType: 'compress',
        inputFormat: req.file.mimetype,
        outputFormat: req.file.mimetype,
        fileSizeMB: fileSizeMB.toString(),
        processingTimeMs: processingTime,
      });

      res.set({
        'Content-Type': req.file.mimetype,
        'Content-Disposition': 'attachment; filename="compressed-image"'
      });
      res.send(processedBuffer);
    } catch (error) {
      console.error('Compress error:', error);
      res.status(500).json({ message: "Image compression failed" });
    }
  });

  // Pro subscription routes
  app.post("/api/subscription/upgrade", authenticateToken, async (req: any, res) => {
    try {
      // In a real implementation, this would integrate with Dodo Payments
      const { subscriptionId } = req.body;
      
      const user = await storage.updateUserProStatus(
        req.user.userId,
        true,
        subscriptionId,
        'active'
      );

      res.json({ 
        message: "Successfully upgraded to Pro", 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          isPro: user.isPro 
        } 
      });
    } catch (error) {
      res.status(500).json({ message: "Upgrade failed" });
    }
  });

  app.get("/api/dashboard/stats", authenticateToken, async (req: any, res) => {
    try {
      const logs = await storage.getUserProcessingLogs(req.user.userId, 100);
      const user = await storage.getUser(req.user.userId);
      
      const stats = {
        totalProcessed: logs.length,
        toolsUsed: [...new Set(logs.map(log => log.toolType))],
        totalSizeMB: logs.reduce((sum, log) => sum + parseFloat(log.fileSizeMB), 0),
        averageProcessingTime: logs.length > 0 
          ? logs.reduce((sum, log) => sum + log.processingTimeMs, 0) / logs.length 
          : 0,
        recentLogs: logs.slice(0, 10),
        isPro: user?.isPro || false
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
