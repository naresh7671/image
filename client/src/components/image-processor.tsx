import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { processImage, formatFileSize, getCompressionRatio, createImagePreview } from "@/lib/image-utils";
import { Download, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageProcessorProps {
  file: File;
  jobType: string;
  outputFormat: string;
  settings?: any;
  onComplete?: () => void;
}

export default function ImageProcessor({ 
  file, 
  jobType, 
  outputFormat, 
  settings = {}, 
  onComplete 
}: ImageProcessorProps) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    jobId: string;
    downloadUrl: string;
    originalSize: number;
    processedSize: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to process images.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create preview
      const previewUrl = await createImagePreview(file);
      setPreview(previewUrl);

      const result = await processImage(file, jobType, outputFormat, settings, token);
      setResult(result);
      
      toast({
        title: "Image Processed Successfully",
        description: `Reduced size by ${getCompressionRatio(result.originalSize, result.processedSize)}%`,
      });

      onComplete?.();
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Processing Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      window.open(result.downloadUrl, '_blank');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Process: {file.name}</span>
          {result && <CheckCircle className="text-green-500" size={20} />}
          {error && <AlertCircle className="text-red-500" size={20} />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Original Size:</span> {formatFileSize(file.size)}
          </div>
          <div>
            <span className="font-medium">Type:</span> {file.type}
          </div>
        </div>

        {/* Preview */}
        {preview && (
          <div className="text-center">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-w-full max-h-48 mx-auto rounded-lg border"
            />
          </div>
        )}

        {/* Processing Controls */}
        {!result && !error && (
          <div className="space-y-4">
            {isProcessing && (
              <div className="space-y-2">
                <Progress value={undefined} className="w-full" />
                <p className="text-sm text-center text-gray-600">Processing image...</p>
              </div>
            )}
            
            <Button 
              onClick={handleProcess} 
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? "Processing..." : `${jobType.charAt(0).toUpperCase() + jobType.slice(1)} Image`}
            </Button>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm bg-green-50 p-4 rounded-lg">
              <div>
                <span className="font-medium">Processed Size:</span> {formatFileSize(result.processedSize)}
              </div>
              <div>
                <span className="font-medium">Reduction:</span> {getCompressionRatio(result.originalSize, result.processedSize)}%
              </div>
            </div>
            
            <Button onClick={handleDownload} className="w-full">
              <Download className="mr-2" size={16} />
              Download Processed Image
            </Button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
            <Button 
              onClick={handleProcess} 
              variant="outline" 
              className="mt-2 w-full"
            >
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
