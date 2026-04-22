import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, User } from 'lucide-react';
import ImageCropper from './ImageCropper';

interface PhotoUploadProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  label,
  value,
  onChange,
  hasError = false,
}) => {
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const handleCropComplete = (croppedImage: string) => {
    onChange(croppedImage);
  };

  return (
    <div className="space-y-1">
      {/* Label */}
      <label className="flex items-center text-sm font-medium text-gray-700">
        <Camera className="w-3 h-3 mr-1" />
        {label}
      </label>

      {/* Content */}
      <div className="flex items-center gap-2">
        {/* Preview */}
        <div
          className={`w-10 h-10 border rounded-md overflow-hidden flex items-center justify-center bg-gray-50 flex-shrink-0 ${
            hasError ? 'border-red-500' : 'border-gray-200'
          }`}
        >
          {value ? (
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-gray-400" />
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-0.5 flex-1">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setIsCropperOpen(true)}
            className="h-10 w-full px-2 text-xs"
          >
            <Camera className="w-3 h-3 mr-1" />
            {value ? 'Change' : 'Upload'}
          </Button>

          {hasError && (
            <p className="text-[10px] text-red-600 leading-tight">
              Photo required
            </p>
          )}
        </div>
      </div>

      {/* Cropper */}
      <ImageCropper
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        onCropComplete={handleCropComplete}
        title={`Upload ${label}`}
      />
    </div>
  );
};

export default PhotoUpload;