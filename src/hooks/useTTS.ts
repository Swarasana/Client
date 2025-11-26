import { useState, useRef, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ttsApi } from '@/api';

// Voice mapping function
const getVoiceType = (narrator?: string): string => {
  if (!narrator) return 'female'; // default to eva
  
  const lowerNarrator = narrator.toLowerCase();
  if (lowerNarrator.includes('anton')) return 'male';
  if (lowerNarrator.includes('eva')) return 'female';
  if (lowerNarrator.includes('dede')) return 'child';
  
  return 'female'; // default to eva
};

export const useTTS = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generate TTS mutation
  const generateTTSMutation = useMutation({
    mutationFn: ({ text, lang = "id-ID", format = "ogg", voiceType = "female" }: { 
      text: string; 
      lang?: string; 
      format?: string;
      voiceType?: string;
    }) => ttsApi.generateSpeech(text, lang, format, voiceType),
    onSuccess: (audioBlob) => {
      // Create audio URL from blob
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      // Create new audio element
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      setCurrentAudio(audio);
      
      // Set up event listeners
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentAudio(null);
        audioRef.current = null;
        setCurrentTime(0);
        setDuration(0);
        URL.revokeObjectURL(audioUrl); // Clean up blob URL
      });
      
      audio.addEventListener('error', () => {
        setIsPlaying(false);
        setCurrentAudio(null);
        audioRef.current = null;
        setCurrentTime(0);
        setDuration(0);
        URL.revokeObjectURL(audioUrl);
      });
      
      // Play the audio
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch(() => {
          setIsPlaying(false);
          setIsLoading(false);
          setCurrentAudio(null);
          audioRef.current = null;
          setCurrentTime(0);
          setDuration(0);
          URL.revokeObjectURL(audioUrl);
        });
    },
    onError: () => {
      setIsLoading(false);
      setIsPlaying(false);
    },
  });

  const speak = useCallback((text: string, lang: string = "id-ID", narrator?: string) => {
    if (!text.trim()) return;
    
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
      setCurrentAudio(null);
    }
    
    const voiceType = getVoiceType(narrator);
    setIsLoading(true);
    generateTTSMutation.mutate({ text, lang, voiceType });
  }, [generateTTSMutation]);

  const stop = useCallback(() => {
    // Stop audio from audioRef
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    // Stop audio from currentAudio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentAudio(null);
    setIsLoading(false);
    setCurrentTime(0);
    setDuration(0);
  }, [currentAudio]);

  const toggle = useCallback(() => {
    if (currentAudio) {
      if (isPlaying) {
        currentAudio.pause();
        setIsPlaying(false);
      } else {
        currentAudio.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            setIsPlaying(false);
            setCurrentAudio(null);
            audioRef.current = null;
          });
      }
    }
  }, [currentAudio, isPlaying]);

  const pause = useCallback(() => {
    if (currentAudio && isPlaying) {
      currentAudio.pause();
      setIsPlaying(false);
    }
  }, [currentAudio, isPlaying]);

  const resume = useCallback(() => {
    if (currentAudio && !isPlaying) {
      currentAudio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
          setCurrentAudio(null);
          audioRef.current = null;
        });
    }
  }, [currentAudio, isPlaying]);

  const seek = useCallback((time: number) => {
    if (currentAudio && duration > 0) {
      const seekTime = Math.max(0, Math.min(time, duration));
      
      // Pause first to prevent overlapping
      const wasPlaying = !currentAudio.paused;
      currentAudio.pause();
      
      // Set the new time
      currentAudio.currentTime = seekTime;
      setCurrentTime(seekTime);
      
      // Resume if it was playing before
      if (wasPlaying) {
        currentAudio.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            setIsPlaying(false);
            setCurrentAudio(null);
            audioRef.current = null;
          });
      }
    }
  }, [currentAudio, duration]);

  return {
    speak,
    stop,
    toggle,
    pause,
    resume,
    seek,
    isPlaying,
    isLoading,
    duration,
    currentTime,
    error: generateTTSMutation.error,
  };
};