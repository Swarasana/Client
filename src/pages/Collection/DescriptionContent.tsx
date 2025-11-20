import React from "react";
import { MessageSquare, ChevronUp, ChevronDown } from "lucide-react";
import { Collection } from "@/types";

interface DescriptionContentProps {
  collection: Collection | undefined;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

const DescriptionContent: React.FC<DescriptionContentProps> = ({ 
  collection, 
  isExpanded, 
  setIsExpanded 
}) => (
  <div className="text-gray-900 h-full flex flex-col">
    {/* Header - Fixed */}
    <div className="flex items-center justify-between mb-4 flex-shrink-0">
      <h2 className="text-lg font-sf font-bold flex items-center">
        <MessageSquare className="w-4 h-4 mr-2" />
        {collection?.name || 'Miniatur Gedung Sate'}
      </h2>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
      >
        <ChevronUp className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
    </div>
    
    {/* Content - Scrollable */}
    <div className={`flex-1 overflow-y-auto ${isExpanded ? '' : 'overflow-hidden'}`}>
      <div className={`text-gray-700 text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-6'}`}>
        {collection?.artist_explanation || "Miniatur ini menampilkan bentuk Gedung Sate pada tahap akhir pembangunannya dari udara. Terlihat dua fondasi di bagian belakang yang direncanakan sebagai lokasi menara antena radio telegraf, namun pembangunan tersebut tidak pernah selesai karena berbagai kendala teknis dan anggaran yang terbatas pada masa itu."}
      </div>
      
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="text-blue-600 hover:text-blue-800 text-sm font-sf mt-2 flex items-center"
        >
          Baca Selengkapnya
          <ChevronDown className="w-3 h-3 ml-1" />
        </button>
      )}
    </div>
  </div>
);

export default DescriptionContent;