import React from "react";
import { Volume2, ChevronUp, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import anton from "@/assets/images/anton.png";
import dede from "@/assets/images/dede.png";
import eva from "@/assets/images/eva.png";

// Audio characters data
const audioCharacters = [
  { 
    name: "Anton", 
    avatar: anton, 
    color: "bg-yellow-400",
    description: "Karakter ramah dan bersemangat" 
  },
  { 
    name: "Dede", 
    avatar: dede, 
    color: "bg-green-400",
    description: "Karakter tenang dan bijaksana"
  },
  { 
    name: "Eva", 
    avatar: eva, 
    color: "bg-blue-400", 
    description: "Karakter ceria dan penuh energi"
  }
];

interface AudioContentProps {
  selectedNarrator: string;
  setSelectedNarrator: (narrator: string) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

const AudioContent: React.FC<AudioContentProps> = ({ 
  selectedNarrator, 
  setSelectedNarrator, 
  isPlaying, 
  onPlayPause, 
  isExpanded, 
  setIsExpanded 
}) => (
  <div className="text-gray-900 h-full flex flex-col">
    {/* Header - Fixed */}
    <div className="flex items-center justify-between mb-4 flex-shrink-0">
      <h2 className="text-lg font-sf font-bold flex items-center">
        <Volume2 className="w-4 h-4 mr-2" />
        Narasi Audio
      </h2>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
      >
        <ChevronUp className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
    </div>

    {/* Content - Fixed layout to fit card height */}
    <div className="flex-1 flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-sf font-semibold mb-2 text-gray-600">Dengarkan Pendapat Mereka</h3>
        <p className="text-xs text-gray-700 mb-3">Hidupkan koleksi ini dari sudut pandang kurator maupun publik dengan suara pilihanmu</p>
      </div>

      {/* Expandable Character Selection */}
      {isExpanded && (
        <div className="mb-4 overflow-y-auto">
          <h4 className="text-xs font-sf font-semibold mb-2 text-gray-600">Pilih Karakter Narator</h4>
          <div className="flex gap-2 justify-center mb-4">
            {audioCharacters.map((character) => (
              <button
                key={character.name}
                onClick={() => setSelectedNarrator(character.name)}
                className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                  selectedNarrator === character.name
                    ? 'bg-blue-50 border border-blue-400'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 ${character.color} rounded-full flex items-center justify-center mb-1 overflow-hidden`}>
                  <img 
                    src={character.avatar} 
                    alt={character.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-sf font-medium">{character.name}</span>
              </button>
            ))}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center p-2 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
              <span className="text-xs font-sf">Versi Kurator</span>
            </div>
            <div className="flex items-center p-2 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
              <span className="text-xs font-sf">Versi Pengunjung</span>
            </div>
          </div>
        </div>
      )}

      {/* Play Button - Centered */}
      <div className={`${isExpanded ? 'flex-shrink-0' : 'flex-1'} flex items-center justify-center`}>
        <Button
          onClick={onPlayPause}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full w-16 h-16 p-0 shadow-lg"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-1" />
          )}
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 flex-shrink-0">
        <div className="w-full bg-gray-200 h-1 rounded-full">
          <div className="bg-blue-500 h-1 rounded-full" style={{ width: '0%' }}></div>
        </div>
      </div>
    </div>
  </div>
);

export default AudioContent;