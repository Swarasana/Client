import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ArtsyImagePlaceholder } from "@/components";
import { useState } from "react";
import { Button } from "../ui/button";

const ClickableImage: React.FC<{
  src?: string;
  alt: string;
  name: string;
  className?: string;
  imageClassName?: string;
  onLike?: () => void;
  isLiked?: boolean;
  likesCount?: number;
  isLiking?: boolean;
}> = ({ src, alt, name, className, imageClassName, onLike, isLiked, likesCount, isLiking }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Check if we have a valid source (same logic as ArtsyImagePlaceholder)
  const isValidSrc = src && src.trim() !== '' && src !== 'undefined' && src !== 'null';
  
  // Show placeholder when no valid src OR when image failed to load
  const isShowingPlaceholder = !isValidSrc || imageError;

  if (isShowingPlaceholder) {
    // Non-clickable placeholder
    return (
      <motion.div
        className="relative w-72 h-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <ArtsyImagePlaceholder
          src={src}
          alt={alt}
          name={name}
          imageClassName={imageClassName}
          className={className}
        />
        {/* Like button overlay */}
        {onLike && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                if (onLike) onLike();
              }}
              size="sm"
              variant="ghost"
              className={`p-0 h-auto w-auto hover:bg-transparent transition-all hover:scale-110 active:scale-125 ${
                isLiked ? 'animate-bounce' : ''
              }`}
            >
              <Heart 
                className={`w-5 h-5 transition-all duration-300 ${
                  isLiked 
                    ? 'fill-pink-500 text-pink-500 scale-110 drop-shadow-lg' 
                    : 'text-white hover:text-pink-200'
                } ${isLiking ? 'animate-pulse' : ''}`} 
              />
            </Button>
            <span className="text-white text-sm font-medium">{likesCount || 0}</span>
          </div>
        )}
      </motion.div>
    );
  }

  // Clickable image with dialog
  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          className="relative w-72 h-auto cursor-pointer hover:scale-105 transition-transform duration-300"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className={className}>
            {/* Show loading placeholder until image loads */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center rounded-3xl">
                <div className="w-8 h-8 text-gray-400">⏳</div>
              </div>
            )}
            
            {/* Actual image */}
            <img
              src={src}
              alt={alt}
              className={imageClassName}
              onError={() => setImageError(true)}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          
          {/* Like button overlay */}
          {onLike && (
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onLike) onLike();
                }}
                size="sm"
                variant="ghost"
                className={`p-0 h-auto w-auto hover:bg-transparent transition-all hover:scale-110 active:scale-125 ${
                  isLiked ? 'animate-bounce' : ''
                }`}
              >
                <Heart 
                  className={`w-5 h-5 transition-all duration-300 ${
                    isLiked 
                      ? 'fill-pink-500 text-pink-500 scale-110 drop-shadow-lg' 
                      : 'text-white hover:text-pink-200'
                  } ${isLiking ? 'animate-pulse' : ''}`} 
                />
              </Button>
              <span className="text-white text-sm font-medium">{likesCount || 0}</span>
            </div>
          )}
        </motion.div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 border-none bg-transparent">
        <DialogTitle className="sr-only">
          {name} - Tampilan Gambar Besar
        </DialogTitle>
        <DialogDescription className="sr-only">
          Gambar koleksi {name} ditampilkan dalam ukuran yang lebih besar untuk melihat detail
        </DialogDescription>
        <div className="relative flex items-center justify-center">
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClickableImage;