import React from "react";
import { Book, Sparkles } from "lucide-react";
import { Collection } from "@/types";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface DescriptionContentProps {
  collection: Collection | undefined;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

const DescriptionContent: React.FC<DescriptionContentProps> = ({ 
  collection, 
  isExpanded, 
  setIsExpanded 
}) => {
  const description = collection?.artist_explanation || "Miniatur ini menampilkan bentuk Gedung Sate pada tahap akhir pembangunannya dari udara. Terlihat dua fondasi di bagian belakang yang direncanakan sebagai lokasi menara antena radio telegraf, namun pembangunan tersebut tidak pernah selesai karena berbagai kendala teknis dan anggaran yang terbatas pada masa itu.";
  
  // Function to estimate if title will be one or two lines
  const getTitleLines = (title: string) => {
    // Rough estimation: if title is longer than ~25 characters, it's likely 2 lines
    const estimatedCharsPerLine = 30;
    return title.length > estimatedCharsPerLine ? 2 : 1;
  };

  // Function to trim title to max 2 lines (rough estimation ~50 chars)
  const trimTitle = (title: string, maxChars = 50) => {
    if (title.length <= maxChars) return title;
    return title.substring(0, maxChars).trim() + '...';
  };

  const title = collection?.name || 'Miniatur Gedung Sate';
  const trimmedTitle = trimTitle(title);
  const titleLines = getTitleLines(trimmedTitle);
  const descriptionClamp = titleLines === 1 ? 'line-clamp-4' : 'line-clamp-3';
  
  return (
    <Drawer open={isExpanded} onOpenChange={setIsExpanded}>
      <DrawerTrigger asChild>
        <div className="text-gray-900 h-full flex flex-col cursor-pointer">
          {/* Header */}
          <div className="flex items-center mb-3">
            <Book className="w-5 h-5 mr-2 text-gray-700" />
            <h2 className="text-lg font-sf font-bold line-clamp-2">
              {trimmedTitle}
            </h2>
          </div>
          
          {/* Preview content */}
          <div className="flex-1">
            <p className={`text-gray-700 text-base font-sf font-light ${descriptionClamp}`}>
              {description}
            </p>
          </div>
        </div>
      </DrawerTrigger>
      
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b border-gray-100 pl-6">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Book className="w-6 h-6 mr-3 text-gray-700" />
              <DrawerTitle className="text-xl font-sf font-bold text-gray-900">
                {title}
              </DrawerTitle>
            </div>
          </div>
          <DrawerDescription className="sr-only">
            Detail koleksi dan deskripsi lengkap
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-6 overflow-y-auto">
          {/* Section Title */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-inter font-semibold text-gray-900">Tentang Koleksi</h3>
            <div className="flex items-center text-teal-600">
              <Sparkles className="w-5 h-5 mr-2 fill-teal-600" />
              <span className="text-base font-sf font-medium">AI Overview</span>
            </div>
          </div>

          {/* Description */}
          <div className="text-gray-700 text-base font-sf mb-6">
            {description}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DescriptionContent;