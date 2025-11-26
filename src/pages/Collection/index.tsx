import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ChevronLeft, 
  Share2,
  Volume2,
  MessageSquare,
  Book
} from "lucide-react";
import { collectionsApi } from "@/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ClickableImage } from "@/components";
import { useToast } from "@/hooks/use-toast";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import { useTTS } from "@/hooks/useTTS";
import DescriptionContent from "./DescriptionContent";
import AudioContent from "./AudioContent";
import CommentsContent from "./CommentsContent";

type ContentType = 'description' | 'audio' | 'comments';

const CollectionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State management
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  
  // Like state
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  
  // Visitor tracking
  const visitorTracking = useVisitorTracking(id!);

  // TTS state management - shared across all components
  const { speak, stop, isPlaying, isLoading, duration, currentTime, pause, resume, seek } = useTTS();
  const [currentPlayingComment, setCurrentPlayingComment] = useState<string | null>(null);
  const [pausedComment, setPausedComment] = useState<string | null>(null);

  // Expand states for each card
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isAudioExpanded, setIsAudioExpanded] = useState(false);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  
  const contentTypes: ContentType[] = ['description', 'audio', 'comments'];

  // Fetch collection details
  const { data: collection, isLoading: collectionLoading } = useQuery({
    queryKey: ['collection', id],
    queryFn: () => collectionsApi.getById(id!),
    enabled: !!id,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch AI Summary for AudioContent
  const { data: aiSummary } = useQuery({
    queryKey: ['collection-ai-summary', id],
    queryFn: async () => {
      try {
        return await collectionsApi.getAISummary(id!);
      } catch (error) {
        return null;
      }
    },
    enabled: !!id,
    retry: 3,
    staleTime: 10 * 60 * 1000,
  });

  // Initialize likes count from collection data
  React.useEffect(() => {
    if (collection) {
      setLikesCount(collection.likes_count || 0);
    }
  }, [collection]);

  // Like collection mutation
  const likeMutation = useMutation({
    mutationFn: () => collectionsApi.like(id!),
    onSuccess: (updatedCollection) => {
      // Update the collection data with the response from server
      queryClient.setQueryData(['collection', id], updatedCollection);
      setLikesCount(updatedCollection.likes_count);
      
      toast({
        title: "Koleksi disukai!",
        description: "Terima kasih atas apresiasi Anda",
        duration: 2000,
      });
    },
    onError: () => {
      toast({
        title: "Gagal menyukai koleksi",
        description: "Silakan coba lagi",
        variant: "destructive",
        duration: 2000,
      });
    },
  });

  // Handle like collection (infinite likes allowed)
  const handleLikeCollection = () => {
    // Always set to liked state when clicked
    setIsLiked(true);
    setLikesCount(prev => prev + 1);
    likeMutation.mutate();
    
    // Reset to non-liked state after animation for better UX
    setTimeout(() => {
      if (!likeMutation.isPending) {
        setIsLiked(false);
      }
    }, 1000);
  };

  // TTS handlers - shared across all components
  const handleTTSClick = (text: string, identifier: string, narrator?: string) => {
    if (isPlaying && currentPlayingComment === identifier) {
      stop();
      setCurrentPlayingComment(null);
    } else if (text.trim()) {
      setCurrentPlayingComment(identifier);
      speak(text, 'id-ID', narrator); // Pass narrator for voice type selection
    }
  };

  const handleCommentTTSClick = (commentId: string, commentText: string, username?: string) => {
    const textToSpeak = username 
      ? `Komentar dari ${username}: ${commentText}`
      : `Komentar: ${commentText}`;
    
    // Use random voice for comments to make it more natural
    const randomVoices = ['male', 'female', 'child'];
    const randomVoice = randomVoices[Math.floor(Math.random() * randomVoices.length)];
    
    handleTTSClick(textToSpeak, commentId, randomVoice); // Use random voice for comments
  };

  const handleAISummaryTTSClick = (aiSummaryText: string) => {
    handleTTSClick(`Ringkasan e-ai: ${aiSummaryText}`, 'ai-summary'); // Use default eva voice
  };

  const handleDescriptionTTSClick = (collectionName: string, description: string) => {
    handleTTSClick(`${collectionName}. ${description}`, 'description'); // Use default eva voice
  };

  const handleAudioTTSClick = (text: string, narrator: string, version: string) => {
    const identifier = `audio-${narrator}-${version}`;
    if (isPlaying && currentPlayingComment === identifier) {
      stop();
      setCurrentPlayingComment(null);
    } else if (text.trim()) {
      setCurrentPlayingComment(identifier);
      speak(text, 'id-ID', narrator); // Pass narrator for voice type selection
    }
  };

  // Reset playing state when audio completely stops (not just paused)
  React.useEffect(() => {
    if (!isPlaying && duration === 0 && currentTime === 0) {
      // Only reset if audio has completely ended/stopped (duration and currentTime are 0)
      setCurrentPlayingComment(null);
      setPausedComment(null);
    }
  }, [isPlaying, duration, currentTime]);

  // Track paused state
  React.useEffect(() => {
    if (!isPlaying && duration > 0) {
      // Audio is paused (not stopped)
      setPausedComment(currentPlayingComment);
    } else if (isPlaying && pausedComment) {
      // Audio resumed
      setPausedComment(null);
    }
  }, [isPlaying, duration, currentPlayingComment, pausedComment]);

  const slideRef = useRef<HTMLDivElement>(null);
  
  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };
  
  // Handle touch events for better mobile interaction
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    
    if (distance > minSwipeDistance) {
      // Swiped left - go to next slide
      setCurrentSlide(prev => Math.min(contentTypes.length - 1, prev + 1));
    } else if (distance < -minSwipeDistance) {
      // Swiped right - go to previous slide
      setCurrentSlide(prev => Math.max(0, prev - 1));
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: collection?.name || 'Koleksi Swarasana',
      text: `Lihat koleksi ${collection?.name} di Swarasana`,
      url: window.location.href,
    };

    try {
      // Check if Web Share API is available
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        toast({
          title: "Berhasil dibagikan!",
          description: "Koleksi telah dibagikan",
          duration: 2000,
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link disalin!",
          description: "Link koleksi berhasil disalin ke clipboard",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Final fallback: Try to copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link disalin!",
          description: "Link koleksi berhasil disalin ke clipboard",
          duration: 2000,
        });
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
        toast({
          title: "Gagal membagikan",
          description: "Silakan salin link secara manual",
          variant: "destructive",
          duration: 2000,
        });
      }
    }
  };

  return (
    <main className="flex flex-col w-full h-screen bg-gradient-to-t from-blue1 via-blue1 to-blue2 text-white overflow-hidden">
      {/* Header - 10% of screen */}
      <div className="flex justify-between items-center px-4 flex-shrink-0" style={{ height: '10vh' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="text-white hover:bg-white/10 p-2 rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="text-white hover:bg-white/10 p-2 rounded-full"
        >
          <Share2 className="w-6 h-6" />
        </Button>
      </div>

      {/* Collection Image - 45% of screen */}
      <div className="flex items-center justify-center px-4 flex-shrink-0 mb-4" style={{ height: '45vh' }}>
        {collectionLoading ? (
          <Skeleton className="w-72 h-72 bg-white/10 rounded-3xl" />
        ) : collection ? (
          <ClickableImage
            src={collection.picture_url}
            alt={collection.name}
            name={collection.name}
            className="w-full h-full rounded-3xl overflow-hidden shadow-2xl"
            imageClassName="w-full h-full object-cover rounded-3xl"
            onLike={handleLikeCollection}
            isLiked={isLiked}
            likesCount={likesCount}
            isLiking={likeMutation.isPending}
            visitorCount={visitorTracking.visitorCount}
            formattedVisitorCount={visitorTracking.formattedVisitorCount}
            isLoadingVisitors={visitorTracking.isLoading}
          />
        ) : null}
      </div>

      {/* Content Carousel - 30% of screen */}
      <div className="px-4 flex-shrink-0 mb-4" style={{ height: '30vh' }}>
        <div 
          className="relative w-full h-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ overflow: 'visible' }}
        >
          <div 
            ref={slideRef}
            className="flex transition-transform duration-300 ease-out h-full items-center"
            style={{ 
              transform: `translateX(calc(50% - 160px - ${currentSlide * 328}px))`,
              gap: '0.5rem'
            }}
          >
            {contentTypes.map((type, index) => {
              const isActive = currentSlide === index;
              return (
                <div 
                  key={type} 
                  className="flex-shrink-0 h-full transition-transform duration-300 ease-out"
                  style={{ 
                    width: '320px',
                    transform: `scale(${isActive ? 1 : 0.9})`
                  }}
                >
                  <div className="bg-white rounded-3xl p-4 shadow-lg w-full h-[90%] overflow-hidden">
                    {collectionLoading ? (
                      // Skeleton loading for content cards
                      <div className="flex flex-col h-full">
                        <div className="flex items-center mb-3">
                          <Skeleton className="w-5 h-5 mr-2" />
                          <Skeleton className="h-5 w-32" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      </div>
                    ) : (
                      <>
                        {type === 'description' && (
                          <DescriptionContent 
                            collection={collection}
                            isExpanded={isDescriptionExpanded}
                            setIsExpanded={setIsDescriptionExpanded}
                            handleTTSClick={handleDescriptionTTSClick}
                            currentPlayingComment={currentPlayingComment}
                            isPlaying={isPlaying}
                            isLoading={isLoading}
                          />
                        )}
                        
                        {type === 'audio' && (
                          <AudioContent
                            isExpanded={isAudioExpanded}
                            setIsExpanded={setIsAudioExpanded}
                            collection={collection}
                            aiSummary={aiSummary}
                            handleAudioTTSClick={handleAudioTTSClick}
                            currentPlayingComment={currentPlayingComment}
                            pausedComment={pausedComment}
                            isPlaying={isPlaying}
                            isLoading={isLoading}
                            duration={duration}
                            currentTime={currentTime}
                            pause={pause}
                            resume={resume}
                            seek={seek}
                          />
                        )}
                        
                        {type === 'comments' && (
                          <CommentsContent
                            collectionId={id!}
                            isExpanded={isCommentsExpanded}
                            setIsExpanded={setIsCommentsExpanded}
                            handleAISummaryTTSClick={handleAISummaryTTSClick}
                            handleCommentTTSClick={handleCommentTTSClick}
                            currentPlayingComment={currentPlayingComment}
                            isPlaying={isPlaying}
                            isLoading={isLoading}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation - 10% of screen */}
      <div className="flex justify-center items-center px-4 flex-shrink-0" style={{ height: '5vh' }}>
        <div className="flex bg-black/30 rounded-full p-1.5 backdrop-blur-sm border border-white/20">
          {contentTypes.map((type, index) => {
            const isActive = currentSlide === index;
            return (
              <button
                key={type}
                onClick={() => handleSlideChange(index)}
                className={`w-12 h-8 rounded-full flex items-center justify-center transition-all duration-300 mx-1 ${
                  isActive 
                    ? 'bg-green-400 text-gray-900 shadow-lg scale-110 transform' 
                    : 'text-white hover:bg-white/20 hover:scale-105'
                }`}
              >
                {type === 'description' && <Book className="w-5 h-5" />}
                {type === 'audio' && <Volume2 className="w-5 h-5" />}
                {type === 'comments' && <MessageSquare className="w-5 h-5" />}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
};


export default CollectionDetail;