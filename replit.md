# replit.md

## Overview

This is a full-stack web application called "imgWorld🌍" - a comprehensive image processing platform that provides free online tools for resizing, converting, compressing, and manipulating images. The application follows a modern architecture with a React frontend, Express.js backend, PostgreSQL database via Drizzle ORM, and is designed to serve both free and premium users.

**Current Status**: Fully functional and ready for deployment (January 26, 2025)

## Recent Changes

### January 26, 2025
- ✓ Fixed application startup issues and database configuration
- ✓ Successfully deployed complete authentication system with JWT tokens
- ✓ Implemented comprehensive image processing backend using Sharp library
- ✓ Created responsive homepage with prominent "Free Image Resizer" feature
- ✓ Built multiple format conversion tools (PNG↔JPG, WebP↔PNG, HEIC→JPG)
- ✓ Added user dashboard with processing analytics and usage statistics
- ✓ Integrated pro subscription system with $5.99/month pricing
- ✓ Designed clean, professional interface inspired by ImageResizer.com
- ✓ Database schema successfully pushed with users and processing_logs tables

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application uses a monorepo structure with clear separation between client and server code:

- **Frontend**: React with TypeScript, built with Vite
- **Backend**: Express.js with TypeScript 
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query for server state, React Context for auth
- **Authentication**: JWT-based authentication
- **File Processing**: Sharp for image manipulation
- **Styling**: Tailwind CSS with custom CSS variables for theming

## Key Components

### Frontend Architecture
- **Component Structure**: Uses shadcn/ui component library for consistent UI
- **Routing**: wouter for client-side routing
- **State Management**: 
  - TanStack Query for server state and caching
  - React Context for authentication state
  - Local component state for UI interactions
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **File Handling**: Custom upload components with drag-and-drop support

### Backend Architecture
- **API Structure**: RESTful API with Express.js
- **Authentication Middleware**: JWT token verification
- **File Upload**: Multer middleware for handling multipart/form-data
- **Image Processing**: Sharp library for image transformations
- **Database Layer**: Drizzle ORM with type-safe queries

### Database Schema
- **Users Table**: Stores user credentials, pro status, and subscription info
- **Processing Logs Table**: Tracks user activity and usage analytics
- **Relations**: One-to-many relationship between users and processing logs

### Authentication System
- **Registration/Login**: Email-based authentication with bcrypt password hashing
- **JWT Tokens**: Stored in localStorage, sent via Authorization header
- **Protected Routes**: Middleware validates tokens for authenticated endpoints
- **User Tiers**: Free vs Pro users with different feature access

## Data Flow

1. **User Registration/Login**: Client sends credentials → Server validates → JWT token returned
2. **File Upload**: Client uploads file → Server validates file type/size → Processing pipeline
3. **Image Processing**: File processed with Sharp → Result cached/stored → Download URL returned
4. **Usage Tracking**: Processing events logged to database for analytics
5. **Premium Features**: Pro status checked before allowing advanced operations

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: PostgreSQL database connection (Neon serverless)
- **drizzle-orm**: Type-safe database ORM
- **sharp**: High-performance image processing
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT authentication
- **multer**: File upload handling

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe CSS class management

### Development Tools
- **vite**: Build tool and dev server
- **typescript**: Type safety
- **tsx**: TypeScript execution for Node.js
- **drizzle-kit**: Database migrations and schema management

## Deployment Strategy

The application is configured for deployment with:

- **Build Process**: 
  - Frontend built with Vite to `dist/public`
  - Backend built with esbuild to `dist/index.js`
- **Environment Variables**: 
  - `DATABASE_URL` for PostgreSQL connection
  - `JWT_SECRET` for token signing
  - `NODE_ENV` for environment detection
- **Database**: Uses Neon serverless PostgreSQL with connection pooling
- **Static Assets**: Frontend served from backend in production
- **Development**: Vite dev server proxied through Express

### Key Features
- **Image Tools**: Resize, convert (PNG↔JPG, WebP, HEIC), compress, crop
- **User Management**: Registration, login, pro subscriptions
- **Usage Analytics**: Processing logs and dashboard statistics
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Ad Integration**: Placeholder for Google AdSense (free users only)
- **File Validation**: Type and size restrictions based on user tier

The architecture prioritizes type safety, performance, and user experience while maintaining clear separation of concerns between frontend and backend systems.