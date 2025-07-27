import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import UploadArea from "@/components/upload-area";
import AdSpace from "@/components/ad-space";
import { processImageWithAuth, downloadBlob, formatFileSize } from "@/lib/image-utils";
import { useToast } from "@/hooks/use-toast";
import { FileImage, Download, RotateCcw } from "lucide-react";

export default function PngToJpg() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [quality, setQuality] = useState(80);

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
      const blob = await processImageWithAuth(selectedFile, '/api/images/convert', {
        format: 'jpeg',
        quality: quality
      });

      downloadBlob(blob, selectedFile.name.replace(/\.png$/i, '.jpg'));
      
      toast({
        title: "Success",
        description: "PNG converted to JPG successfully!"
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
    setQuality(80);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileImage className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">PNG to JPG Converter</h1>
          </div>
          <p className="text-xl text-gray-600">Convert PNG images to JPG format for smaller file sizes</p>
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
                <span>Conversion Settings</span>
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
                    <p className="font-medium">PNG</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Output Format:</span>
                    <p className="font-medium">JPG</p>
                  </div>
                </div>
              </div>

              {/* Quality Slider */}
              <div>
                <Label>JPG Quality: {quality}%</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Higher quality = larger file size, Lower quality = smaller file size
                </p>
                <Slider
                  value={[quality]}
                  onValueChange={(value) => setQuality(value[0])}
                  max={100}
                  min={10}
                  step={10}
                  className="mt-2"
                />
              </div>

              {/* Convert Button */}
              <Button 
                onClick={handleConvert}
                disabled={processing}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {processing ? (
                  "Converting..."
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Convert to JPG
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
              <FileImage className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Smaller File Sizes</h3>
              <p className="text-gray-600 text-sm">JPG files are typically 50-80% smaller than PNG files</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Download className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Universal Compatibility</h3>
              <p className="text-gray-600 text-sm">JPG is supported by all web browsers and image viewers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <RotateCcw className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Quality Control</h3>
              <p className="text-gray-600 text-sm">Adjust quality settings to balance file size and image quality</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
