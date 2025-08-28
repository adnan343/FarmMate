'use client';

import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

export default function FarmPhotoUpload({ photo, onPhotoChange }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      // For now, we'll use a placeholder URL
      // In a real app, you'd upload to a cloud service like AWS S3, Cloudinary, etc.
      const photoUrl = URL.createObjectURL(file);
      
      onPhotoChange({
        file,
        url: photoUrl,
        caption: '',
        uploadedAt: new Date()
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = () => {
    onPhotoChange(null);
  };

  const updateCaption = (caption) => {
    if (photo) {
      onPhotoChange({
        ...photo,
        caption
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Farm Photo</h3>
        {photo && (
          <button
            type="button"
            onClick={removePhoto}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
      </div>

      {/* Upload button */}
      {!photo && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Photo display */}
      {photo ? (
        <div className="relative rounded-lg overflow-hidden shadow-md">
          <img 
            src={photo.url} 
            alt="Farm condition" 
            className="w-full h-48 sm:h-64 object-cover" 
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3 sm:p-4">
            <input
              type="text"
              value={photo.caption}
              onChange={(e) => updateCaption(e.target.value)}
              placeholder="Add a caption (optional)"
              className="w-full bg-transparent border-none text-white placeholder-white/70 focus:outline-none focus:ring-0 text-sm sm:text-base"
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8 border border-dashed border-gray-300 rounded-lg">
          <ImageIcon className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-gray-600 mb-2">No photo uploaded yet</p>
          <p className="text-xs sm:text-sm text-gray-500">Upload a photo to document farm conditions</p>
        </div>
      )}
    </div>
  );
}

