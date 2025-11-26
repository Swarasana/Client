import React from "react";
import { Volume2, Play, Pause, Loader2 } from "lucide-react";
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
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  collection: any;
  aiSummary?: { text: string } | null;
  handleAudioTTSClick: (text: string, narrator: string, version: string) => void;
  currentPlayingComment: string | null;
  pausedComment: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  duration: number;
  currentTime: number;
  pause: () => void;
  resume: () => void;
  seek: (time: number) => void;
}

const AudioContent: React.FC<AudioContentProps> = ({ 
  isExpanded, 
  setIsExpanded,
  collection,
  aiSummary,
  handleAudioTTSClick,
  currentPlayingComment,
  pausedComment,
  isPlaying: parentIsPlaying,
  isLoading: parentIsLoading,
  duration: audioDuration,
  currentTime: audioCurrentTime,
  pause,
  resume,
  seek
}) => {
  // Internal state management - now self-contained
  const [selectedNarrator, setSelectedNarrator] = React.useState<string>('Anton');
  const [selectedVersion, setSelectedVersion] = React.useState<string>('');
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const progressBarRef = React.useRef<HTMLDivElement>(null);
  const previousConfigRef = React.useRef<{narrator: string, version: string}>({
    narrator: selectedNarrator,
    version: selectedVersion
  });
  
  // Get text to speak based on selection
  const getTextToSpeak = (): string => {
    if (selectedVersion === 'kurator') {
      // Use curator description (collection description)
      return collection?.artist_explanation || '';
    } else if (selectedVersion === 'Publik') {
      // Use AI summary
      return aiSummary?.text || '';
    }
    return '';
  };
  
  // Check if form is complete and content is available
  const isFormComplete = selectedNarrator && selectedVersion;
  const hasValidContent = isFormComplete && getTextToSpeak().trim().length > 0;
  
  // Get the audio identifier for this specific configuration
  const getAudioIdentifier = () => `audio-${selectedNarrator}-${selectedVersion}`;
  
  // Check if this audio configuration is currently playing
  const isThisAudioPlaying = parentIsPlaying && currentPlayingComment === getAudioIdentifier();
  
  // Check if this audio is the active one (playing or paused)
  const isThisAudioActive = currentPlayingComment === getAudioIdentifier() || pausedComment === getAudioIdentifier();
  
  // Calculate progress percentage from real audio duration and current time
  // Show progress when this is the active audio and has duration
  const progress = isThisAudioActive && audioDuration > 0 && audioCurrentTime >= 0
    ? (audioCurrentTime / audioDuration) * 100 
    : 0;

  // Reset audio when form selection changes
  React.useEffect(() => {
    const previousConfig = previousConfigRef.current;
    const hasConfigChanged = 
      previousConfig.narrator !== selectedNarrator || 
      previousConfig.version !== selectedVersion;

    if (hasConfigChanged && audioDuration > 0) {
      console.log('Form changed, stopping audio:', { 
        from: previousConfig, 
        to: { narrator: selectedNarrator, version: selectedVersion },
        isActive: isThisAudioActive,
        isPlaying: parentIsPlaying,
        duration: audioDuration
      });
      
      // Force stop any existing audio regardless of current identifiers
      stop();
    }

    // Update the previous config
    previousConfigRef.current = {
      narrator: selectedNarrator,
      version: selectedVersion
    };
  }, [selectedNarrator, selectedVersion, stop, isThisAudioActive, isThisAudioPlaying, audioDuration]);
  
  // Helper function to format time in MM:SS format
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle seeking by clicking/dragging on progress bar
  const handleProgressBarInteraction = (clientX: number) => {
    if (!progressBarRef.current || audioDuration <= 0 || !isThisAudioActive) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = (clientX - rect.left) / rect.width;
    const seekTime = Math.max(0, Math.min(clickPosition * audioDuration, audioDuration));
    
    seek(seekTime);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioDuration <= 0 || !isThisAudioActive) return;
    setIsDragging(true);
    handleProgressBarInteraction(e.clientX);
    e.preventDefault(); // Prevent text selection
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (audioDuration <= 0 || !isThisAudioActive) return;
    setIsDragging(true);
    handleProgressBarInteraction(e.touches[0].clientX);
    e.preventDefault();
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (isDragging) {
      handleProgressBarInteraction(e.clientX);
    }
  }, [isDragging, audioDuration, seek, isThisAudioActive]);

  const handleTouchMove = React.useCallback((e: TouchEvent) => {
    if (isDragging) {
      handleProgressBarInteraction(e.touches[0].clientX);
      e.preventDefault();
    }
  }, [isDragging, audioDuration, seek, isThisAudioActive]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchEnd = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global event listeners for dragging
  React.useEffect(() => {
    if (isDragging) {
      // Mouse events
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Touch events
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);
  
  // Audio playback handler
  const handlePlayPause = () => {
    if (isThisAudioPlaying) {
      // If currently playing this audio, pause it
      pause();
    } else if (isThisAudioActive && audioDuration > 0) {
      // If audio exists (was paused), resume from last position
      resume();
    } else {
      // If no audio or starting fresh, generate new TTS
      const textToSpeak = getTextToSpeak();
      if (textToSpeak.trim()) {
        handleAudioTTSClick(textToSpeak, selectedNarrator, selectedVersion);
      }
    }
  };
  
  
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
                  if (hasValidContent) {
                    handlePlayPause();
                  }
                }}
                disabled={!hasValidContent || parentIsLoading}
                className={`rounded-full w-12 h-12 p-0 shadow-lg transition-all ${
                  hasValidContent 
                    ? 'bg-yellow-400 hover:bg-yellow-600 text-black' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {parentIsLoading && currentPlayingComment === getAudioIdentifier() ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isThisAudioPlaying ? (
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
              <div 
                ref={progressBarRef}
                className={`relative w-full bg-gray-200 h-2 rounded-full cursor-pointer hover:h-3 transition-all ${
                  isThisAudioActive && audioDuration > 0 ? 'hover:bg-gray-300' : ''
                }`}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                <div 
                  className="bg-gray-900 h-full rounded-full transition-all duration-100 ease-linear" 
                  style={{ width: `${progress}%` }}
                ></div>
                
                {/* Draggable thumb - only show when audio exists */}
                {isThisAudioActive && audioDuration > 0 && (
                  <div
                    className={`absolute top-1/2 w-4 h-4 bg-gray-900 rounded-full border-2 border-white shadow-lg transform -translate-y-1/2 transition-all ${
                      isDragging ? 'scale-125' : 'hover:scale-110'
                    }`}
                    style={{ left: `calc(${progress}% - 8px)` }}
                  />
                )}
              </div>
            </div>
            
            {/* Time display */}
            <div className="flex justify-between text-xs text-gray-500 font-sf">
              <span>{formatTime(isThisAudioActive ? audioCurrentTime : 0)}</span>
              <span>{formatTime(isThisAudioActive && audioDuration > 0 ? audioDuration : 0)}</span>
            </div>
            
            {/* Play Button */}
            <div className="flex justify-center">
              <Button
                onClick={handlePlayPause}
                disabled={!hasValidContent || parentIsLoading}
                className={`rounded-full w-16 h-16 p-0 shadow-lg transition-all ${
                  hasValidContent 
                    ? 'bg-yellow-400 hover:bg-yellow-600 text-black' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {parentIsLoading && currentPlayingComment === getAudioIdentifier() ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : isThisAudioPlaying ? (
                  <Pause className="w-8 h-8 fill-black" />
                ) : (
                  <Play className="w-8 h-8 ml-1 fill-black" />
                )}
              </Button>
            </div>
            
            {/* Form validation message */}
            {!isFormComplete ? (
              <div className="text-center">
                <p className="text-sm text-gray-500 font-sf">
                  Pilih karakter narator dan versi narasi untuk memutar audio
                </p>
              </div>
            ) : !getTextToSpeak().trim() ? (
              <div className="text-center">
                <p className="text-sm text-orange-600 font-sf">
                  {selectedVersion === 'kurator' 
                    ? 'Deskripsi kurator tidak tersedia untuk koleksi ini' 
                    : 'Ringkasan AI tidak tersedia untuk koleksi ini'
                  }
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AudioContent;