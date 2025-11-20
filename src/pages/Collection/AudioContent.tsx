import React from "react";
import { Volume2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import anton from "@/assets/images/anton.png";
import dede from "@/assets/images/dede.png";
import eva from "@/assets/images/eva.png";
import kurator from "@/assets/images/kurator.png";
import publik from "@/assets/images/publik.png";

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

// Narration version characters data
const narrationVersions = [
  {
    name: "Kurator",
    key: "kurator",
    avatar: kurator, // Using Anton for curator version
    color: "bg-[#FFEBB2]",
    description: "Penjelasan ahli dan mendalam"
  },
  {
    name: "Publik", 
    key: "Publik",
    avatar: publik, // Using Eva for visitor version
    color: "bg-[#FFEBB2]",
    description: "Perspektif publik dan pengalaman"
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
}) => {
  const [selectedVersion, setSelectedVersion] = React.useState<string>('');
  const [progress, setProgress] = React.useState<number>(0);
  
  // Audio simulation - 30 seconds total
  const AUDIO_DURATION = 30000; // 30 seconds in ms
  
  // Check if form is complete
  const isFormComplete = selectedNarrator && selectedVersion;
  
  // Audio progress simulation
  React.useEffect(() => {
    let interval: number;
    
    if (isPlaying && isFormComplete) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (AUDIO_DURATION / 100)); // Update every 100ms
          if (newProgress >= 100) {
            onPlayPause(); // Auto-stop when finished
            return 100;
          }
          return newProgress;
        });
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isFormComplete, onPlayPause]);
  
  // Reset progress when stopping
  React.useEffect(() => {
    if (!isPlaying) {
      // Small delay before resetting to show completion
      const timeout = setTimeout(() => {
        if (!isPlaying) setProgress(0);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isPlaying]);
  
  return (
    <Drawer open={isExpanded} onOpenChange={setIsExpanded}>
      <DrawerTrigger asChild>
        <div className="text-gray-900 h-full flex flex-col cursor-pointer">
          {/* Header */}
          <div className="flex items-center mb-3">
            <Volume2 className="w-5 h-5 mr-2 text-gray-700" />
            <h2 className="text-lg font-sf font-bold">Narasi Audio</h2>
          </div>
          
          {/* Preview content */}
          <div className="flex-1 flex">
            {/* Left side - Content */}
            <div className="flex-1">
              <h3 className="text-base font-sf font-semibold mb-2 text-gray-900">Dengarkan Pendapat Mereka</h3>
              <p className="text-gray-700 text-base font-sf font-light line-clamp-3">
                Hidupkan koleksi ini dari sudut pandang kurator maupun publik dengan suara pilihanmu
              </p>
            </div>

            {/* Right side - Play Button */}
            <div className="flex items-center justify-center px-4 pr-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isFormComplete) {
                    onPlayPause();
                  }
                }}
                disabled={!isFormComplete}
                className={`rounded-full w-12 h-12 p-0 shadow-lg transition-all ${
                  isFormComplete 
                    ? 'bg-yellow-400 hover:bg-yellow-600 text-black' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-black" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5 fill-black" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DrawerTrigger>
      
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b border-gray-100 pl-6">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Volume2 className="w-6 h-6 mr-3 text-gray-700" />
              <DrawerTitle className="text-xl font-sf font-bold text-gray-900">
                Narasi Audio
              </DrawerTitle>
            </div>
            {/* <Button 
              size="sm" 
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full p-2"
            >
              <Volume2 className="w-4 h-4" />
            </Button> */}
          </div>
          <DrawerDescription className="sr-only">
            Pilih karakter narator dan dengarkan audio
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-6 overflow-y-auto">
          {/* Character Narrator Section */}
          <div className="mb-6">
            <h3 className="text-lg font-inter font-semibold text-gray-900 mb-4">Karakter Narator</h3>
            <div className="flex gap-6 justify-center">
              {audioCharacters.map((character) => (
                <button
                  key={character.name}
                  onClick={() => setSelectedNarrator(character.name)}
                  className={`flex flex-col items-center transition-all ${
                    selectedNarrator === character.name ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  <div className={`w-20 h-20 ${character.color} rounded-full flex items-center justify-center mb-2 overflow-hidden ${
                    selectedNarrator === character.name ? 'ring-4 ring-blue-400 ring-opacity-50' : ''
                  }`}>
                    <img 
                      src={character.avatar} 
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-sf font-medium text-gray-900">{character.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Version Selection - Character Style */}
          <div className="mb-8">
            <h3 className="text-lg font-inter font-semibold text-gray-900 mb-4">Pilih Narasi</h3>
            <div className="flex gap-6 justify-center">
              {narrationVersions.map((version) => (
                <button
                  key={version.key}
                  onClick={() => setSelectedVersion(version.key)}
                  className={`flex flex-col items-center transition-all ${
                    selectedVersion === version.key ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  <div className={`w-20 h-20 ${version.color} rounded-full flex items-center justify-center mb-2 overflow-hidden ${
                    selectedVersion === version.key ? 'ring-4 ring-blue-400 ring-opacity-50' : ''
                  }`}>
                    <img 
                      src={version.avatar} 
                      alt={version.name}
                      className="w-full h-full object-cover p-3"
                    />
                  </div>
                  <span className="text-sm font-sf font-medium text-gray-900">{version.name}</span>
                  <span className="text-xs font-sf text-gray-500 text-center px-2">{version.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Audio Controls */}
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="w-full">
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div 
                  className="bg-gray-900 h-2 rounded-full transition-all duration-100 ease-linear" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            {/* Time display */}
            <div className="flex justify-between text-xs text-gray-500 font-sf">
              <span>0:{String(Math.floor((progress / 100) * 30)).padStart(2, '0')}</span>
              <span>0:30</span>
            </div>
            
            {/* Play Button */}
            <div className="flex justify-center">
              <Button
                onClick={onPlayPause}
                disabled={!isFormComplete}
                className={`rounded-full w-16 h-16 p-0 shadow-lg transition-all ${
                  isFormComplete 
                    ? 'bg-yellow-400 hover:bg-yellow-600 text-black' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 fill-black" />
                ) : (
                  <Play className="w-8 h-8 ml-1 fill-black" />
                )}
              </Button>
            </div>
            
            {/* Form validation message */}
            {!isFormComplete && (
              <div className="text-center">
                <p className="text-sm text-gray-500 font-sf">
                  Pilih karakter narator dan versi narasi untuk memutar audio
                </p>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AudioContent;