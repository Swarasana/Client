import React, { useState } from "react";
import { Image } from "lucide-react";

// Artsy placeholder component
const ArtsyPlaceholder: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const colors = [
    'from-purple-400 to-pink-400',
    'from-blue-400 to-cyan-400', 
    'from-green-400 to-blue-500',
    'from-yellow-400 to-orange-500',
    'from-pink-400 to-red-500',
    'from-indigo-400 to-purple-500'
  ];
  
  // Generate consistent color based on name hash (deterministic, not random)
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };
  
  const colorIndex = hashCode(name) % colors.length;
  const selectedColor = colors[colorIndex];
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className={`w-full h-64 bg-gradient-to-br ${selectedColor} flex items-center justify-center`}>
        {/* Artistic background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white/40 rounded-full" />
          <div className="absolute top-12 right-8 w-4 h-4 bg-white/30 rounded-full" />
          <div className="absolute bottom-16 left-8 w-6 h-6 border border-white/40 rotate-45" />
          <div className="absolute bottom-8 right-12 w-3 h-3 bg-white/40 rounded-full" />
        </div>
        
        {/* Center content */}
        <div className="relative z-10 text-center text-white">
          <div className="text-2xl font-bold mb-1">{initial}</div>
        </div>
      </div>
    </div>
  );
};

interface ArtsyImageProps {
  src?: string;
  alt: string;
  name: string; // For placeholder personalization
  className?: string;
  imageClassName?: string;
  variant?: "default" | "aspect-fill"; // aspect-fill for cards that need specific aspect ratios
}

// Reusable Image component with artsy fallback
const ArtsyImagePlaceholder: React.FC<ArtsyImageProps> = ({ 
  src, 
  alt, 
  name, 
  className = "", 
  imageClassName = "",
  variant = "default"
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Check if we have a valid source
  const isValidSrc = src && src.trim() !== '' && src !== 'undefined' && src !== 'null';
  
  // Show artsy placeholder only when:
  // 1. No valid src provided initially, OR
  // 2. Image failed to load after attempting to load
  if (!isValidSrc || imageError) {
    if (variant === "aspect-fill") {
      return (
        <div className={`relative overflow-hidden ${className}`}>
          <ArtsyPlaceholder name={name} className="absolute inset-0" />
        </div>
      );
    }
    return <ArtsyPlaceholder name={name} className={className} />;
  }

  // For valid images, render the image directly
  return (
    <div className={className}>
      {/* Show loading placeholder until image loads */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <Image className="w-8 h-8 text-gray-400" />
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
  );
};

export default ArtsyImagePlaceholder;