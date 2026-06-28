import { useCallback } from 'react';
import { Image, Upload, X } from 'lucide-react';
import { ProfileImage } from '../types';

interface ImageUploadProps {
  images: ProfileImage[];
  onImagesChange: (images: ProfileImage[]) => void;
}

export function ImageUpload({ images, onImagesChange }: ImageUploadProps) {
  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages: ProfileImage[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        newImages.push({
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          preview,
          name: file.name,
        });
      }
    });

    onImagesChange([...images, ...newImages]);
  }, [images, onImagesChange]);

  const removeImage = (id: string) => {
    const img = images.find(i => i.id === id);
    if (img) URL.revokeObjectURL(img.preview);
    onImagesChange(images.filter(i => i.id !== id));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  return (
    <div id="images" className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-violet-500/10 rounded-lg">
          <Image className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-dark-100">Profile Pictures</h3>
          <p className="text-sm text-dark-400">Upload images for profiles (shared across all accounts)</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Drop Zone */}
        <label
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-dark-600 rounded-xl hover:border-violet-500/50 hover:bg-violet-500/5 transition-all cursor-pointer"
        >
          <Upload className="w-8 h-8 text-dark-500 mb-2" />
          <span className="text-sm text-dark-400">Drop images or click to upload</span>
          <span className="text-xs text-dark-500 mt-1">JPG, PNG, WebP</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
        </label>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-dark-600">
                <img
                  src={img.preview}
                  alt={img.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1 right-1 p-1 bg-dark-900/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <div className="text-sm text-dark-400">
            {images.length} image{images.length !== 1 ? 's' : ''} loaded
          </div>
        )}
      </div>
    </div>
  );
}
