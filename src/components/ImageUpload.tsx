import { useState, useCallback } from 'react';
import { ImageIcon, X, Upload, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { ProfileImage } from '../types';

interface ImageUploadProps {
  images: ProfileImage[];
  onImagesChange: (images: ProfileImage[]) => void;
}

export function ImageUpload({ images, onImagesChange }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const newImages: ProfileImage[] = [];
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return;
      }
      newImages.push({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      });
    });

    if (images.length + newImages.length > 6) {
      toast.error('Maximum 6 images allowed');
      return;
    }

    onImagesChange([...images, ...newImages]);
    if (newImages.length > 0) {
      toast.success(`Added ${newImages.length} image(s)`);
    }
  }, [images, onImagesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDelete = (id: string) => {
    const img = images.find(i => i.id === id);
    if (img) URL.revokeObjectURL(img.preview);
    onImagesChange(images.filter(i => i.id !== id));
  };

  const handleBrowse = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => handleFiles((e.target as HTMLInputElement).files);
    input.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <motion.section
      id="images"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-500/20 rounded-lg">
            <ImageIcon className="w-5 h-5 text-pink-400" />
          </div>
          <h2 className="text-lg font-semibold text-dark-100">Profile Images</h2>
          {images.length > 0 && (
            <span className="badge bg-pink-500/20 text-pink-300">{images.length}/6</span>
          )}
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleBrowse}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-brand-400 bg-brand-500/10'
            : 'border-dark-600 hover:border-dark-400 hover:bg-dark-800/50'
        }`}
      >
        <Upload className={`w-10 h-10 mx-auto mb-3 ${isDragging ? 'text-brand-400' : 'text-dark-500'}`} />
        <p className="text-sm text-dark-300">Drop images here or click to browse</p>
        <p className="text-xs text-dark-500 mt-1">JPG, PNG, WebP - Max 6 images</p>
      </div>

      {images.length > 6 && (
        <div className="mt-3 flex items-center gap-2 text-yellow-400 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>Maximum 6 images recommended</span>
        </div>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          <AnimatePresence>
            {images.map((img) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group rounded-lg overflow-hidden border border-dark-700"
              >
                <img
                  src={img.preview}
                  alt={img.name}
                  className="w-full h-24 object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
                    className="p-1.5 bg-red-500 rounded-full text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="p-1.5 bg-dark-800">
                  <p className="text-xs text-dark-400 truncate">{img.name}</p>
                  <p className="text-xs text-dark-500">{formatSize(img.size)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.section>
  );
}
