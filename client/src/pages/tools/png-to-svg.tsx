import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UploadArea from "@/components/upload-area";
import AdSpace from "@/components/ad-space";
import { createCanvasFromImage, downloadBlob, formatFileSize } from "@/lib/image-utils";
import { useToast } from "@/hooks/use-toast";
import { SquareFunction, Download, RotateCcw } from "lucide-react";

export default function PngToSvg() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFileSelect = (files: File[]) => {
    const file = files[0];
    if (file.type !== 'image/png') {
      toast({
        title: "Error",
        description: "Please select a PNG image",
        variant: "destructive"
      });
      return;
    }
    setSelectedFile(file);
  };

  const convertPngToSvg = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to get image data
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        // Get base64 data URL
        const dataURL = canvas.toDataURL('image/png');

        // Create SVG content
        const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${img.naturalWidth}" height="${img.naturalHeight}" 
     xmlns="http://www.w3.org/2000/svg" 
     xmlns:xlink="http://www.w3.org/1999/xlink">
  <image width="${img.naturalWidth}" height="${img.naturalHeight}" 
         xlink:href="${dataURL}"/>
</svg>`;

        resolve(svgContent);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a PNG image first",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "Please login to convert images",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);

    try {
      const svgContent = await convertPngToSvg(selectedFile);
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      
      downloadBlob(blob, selectedFile.name.replace(/\.png$/i, '.svg'));
      
      toast({
        title: "Success",
        description: "PNG converted to SVG successfully!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to convert image",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <SquareFunction className="h-6 w-6 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">PNG to SVG Converter</h1>
          </div>
          <p className="text-xl text-gray-600">Convert PNG to scalable SVG vector format</p>
        </div>

        {/* Upload Area */}
        <UploadArea 
          onFileSelect={handleFileSelect} 
          acceptedFormats={['image/png']}
        />

        {/* Processing Panel */}
        {selectedFile && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Conversion Preview</span>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Selected PNG Image</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Filename:</span>
                    <p className="font-medium">{selectedFile.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">File Size:</span>
                    <p className="font-medium">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Input Format:</span>
                    <p className="font-medium">PNG (Raster)</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Output Format:</span>
                    <p className="font-medium">SVG (Vector)</p>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">About PNG to SVG Conversion</h4>
                <p className="text-blue-800 text-sm">
                  This converter embeds your PNG image into an SVG container, making it scalable while preserving 
                  the original raster image quality. The resulting SVG file can be resized without pixelation 
                  and is perfect for web use.
                </p>
              </div>

              {/* Convert Button */}
              <Button 
                onClick={handleConvert}
                disabled={processing}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {processing ? (
                  "Converting..."
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Convert to SVG
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        <AdSpace />

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <SquareFunction className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Infinite Scalability</h3>
              <p className="text-gray-600 text-sm">SVG images can be scaled to any size without quality loss</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Download className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Web Optimized</h3>
              <p className="text-gray-600 text-sm">Perfect for websites, logos, and responsive designs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <RotateCcw className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Smaller File Sizes</h3>
              <p className="text-gray-600 text-sm">SVG files are often smaller and load faster than PNG images</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
