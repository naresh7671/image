import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface UploadAreaProps {
  onFileSelect: (files: File[]) => void;
  multiple?: boolean;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

export default function UploadArea({ 
  onFileSelect, 
  multiple = false, 
  maxSizeMB,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
}: UploadAreaProps) {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  
  const defaultMaxSize = user?.isPro ? 100 : 10;
  const actualMaxSize = maxSizeMB || defaultMaxSize;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => {
      const sizeInMB = file.size / (1024 * 1024);
      return acceptedFormats.includes(file.type) && sizeInMB <= actualMaxSize;
    });
    
    if (files.length > 0) {
      onFileSelect(multiple ? files : [files[0]]);
    }
  }, [onFileSelect, multiple, actualMaxSize, acceptedFormats]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => {
      const sizeInMB = file.size / (1024 * 1024);
      return acceptedFormats.includes(file.type) && sizeInMB <= actualMaxSize;
    });
    
    if (files.length > 0) {
      onFileSelect(multiple ? files : [files[0]]);
    }
  }, [onFileSelect, multiple, actualMaxSize, acceptedFormats]);

  return (
    <div 
      className={`bg-blue-500 rounded-2xl p-12 mb-8 border-2 border-dashed transition-colors cursor-pointer ${
        isDragging ? 'border-blue-400 bg-blue-400' : 'border-blue-300 hover:border-blue-400'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center space-y-6">
        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-white" />
        </div>
        
        <label className="cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept={acceptedFormats.join(',')}
            multiple={multiple}
            onChange={handleFileInputChange}
          />
          <Button 
            type="button"
            className="bg-white text-blue-600 hover:bg-gray-50 flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Select Images</span>
          </Button>
        </label>
        
        <p className="text-white text-lg">or, drag and drop images here</p>
        
        <div className="text-white text-sm opacity-90">
          <p>
            Max file size: {actualMaxSize} MB.{" "}
            {!user?.isPro && (
              <Link href="/#pricing" className="underline hover:no-underline">
                Sign up for more.
              </Link>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
