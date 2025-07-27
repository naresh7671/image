import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import UploadArea from "@/components/upload-area";
import AdSpace from "@/components/ad-space";
import { processImageWithAuth, downloadBlob, formatFileSize, getImageDimensions } from "@/lib/image-utils";
import { useToast } from "@/hooks/use-toast";
import { Expand, Download, RotateCcw } from "lucide-react";

export default function ImageResizer() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [settings, setSettings] = useState({
    width: "",
    height: "",
    quality: 80,
    maintainAspectRatio: true
  });

  const handleFileSelect = async (files: File[]) => {
    const file = files[0];
    setSelectedFile(file);
    
    try {
      const dimensions = await getImageDimensions(file);
      setOriginalDimensions(dimensions);
      setSettings(prev => ({
        ...prev,
        width: dimensions.width.toString(),
        height: dimensions.height.toString()
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to read image dimensions",
        variant: "destructive"
      });
    }
  };

  const handleWidthChange = (value: string) => {
    setSettings(prev => {
      const newSettings = { ...prev, width: value };
      
      if (prev.maintainAspectRatio && originalDimensions && value) {
        const ratio = originalDimensions.height / originalDimensions.width;
        newSettings.height = Math.round(parseInt(value) * ratio).toString();
      }
      
      return newSettings;
    });
  };

  const handleHeightChange = (value: string) => {
    setSettings(prev => {
      const newSettings = { ...prev, height: value };
      
      if (prev.maintainAspectRatio && originalDimensions && value) {
        const ratio = originalDimensions.width / originalDimensions.height;
        newSettings.width = Math.round(parseInt(value) * ratio).toString();
      }
      
      return newSettings;
    });
  };

  const handleResize = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select an image first",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "Please login to resize images",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);

    try {
      const blob = await processImageWithAuth(selectedFile, '/api/images/resize', {
        width: settings.width,
        height: settings.height,
        quality: settings.quality
      });

      downloadBlob(blob, `resized-${selectedFile.name.replace(/\.[^/.]+$/, '')}.jpg`);
      
      toast({
        title: "Success",
        description: "Image resized successfully!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resize image",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setOriginalDimensions(null);
    setSettings({
      width: "",
      height: "",
      quality: 80,
      maintainAspectRatio: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Expand className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Image Resizer</h1>
          </div>
          <p className="text-xl text-gray-600">Resize images to any dimension while maintaining quality</p>
        </div>

        {/* Upload Area */}
        <UploadArea onFileSelect={handleFileSelect} />

        {/* Processing Panel */}
        {selectedFile && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Resize Settings</span>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Selected Image</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Filename:</span>
                    <p className="font-medium">{selectedFile.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">File Size:</span>
                    <p className="font-medium">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  {originalDimensions && (
                    <>
                      <div>
                        <span className="text-gray-600">Original Width:</span>
                        <p className="font-medium">{originalDimensions.width}px</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Original Height:</span>
                        <p className="font-medium">{originalDimensions.height}px</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Dimension Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="width">Width (pixels)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={settings.width}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    placeholder="Enter width"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (pixels)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={settings.height}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    placeholder="Enter height"
                  />
                </div>
              </div>

              {/* Aspect Ratio Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="aspectRatio"
                  checked={settings.maintainAspectRatio}
                  onChange={(e) => setSettings(prev => ({ ...prev, maintainAspectRatio: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="aspectRatio">Maintain aspect ratio</Label>
              </div>

              {/* Quality Slider */}
              <div>
                <Label>Quality: {settings.quality}%</Label>
                <Slider
                  value={[settings.quality]}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, quality: value[0] }))}
                  max={100}
                  min={10}
                  step={10}
                  className="mt-2"
                />
              </div>

              {/* Process Button */}
              <Button 
                onClick={handleResize}
                disabled={processing || !settings.width || !settings.height}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {processing ? (
                  "Processing..."
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Resize & Download
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        <AdSpace />

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Expand className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Flexible Resizing</h3>
              <p className="text-gray-600 text-sm">Resize to any dimension or maintain original aspect ratio</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Download className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Quality Control</h3>
              <p className="text-gray-600 text-sm">Adjust compression quality to balance file size and image quality</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <RotateCcw className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Instant Processing</h3>
              <p className="text-gray-600 text-sm">Fast server-side processing for reliable results</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
