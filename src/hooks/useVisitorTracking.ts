import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { visitorsApi } from '@/api';

export const useVisitorTracking = (collectionId: string) => {
  const queryClient = useQueryClient();
  const [hasTracked, setHasTracked] = useState(false);

  // Fetch visitor count
  const { data: visitorData, isLoading } = useQuery({
    queryKey: ['visitor-count', collectionId],
    queryFn: () => visitorsApi.getVisitorCount(collectionId),
    enabled: !!collectionId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Track visit mutation
  const trackVisitMutation = useMutation({
    mutationFn: () => {
      // Get or generate session ID for better tracking
      let sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('sessionId', sessionId);
      }
      return visitorsApi.trackVisit(collectionId, sessionId);
    },
    onSuccess: (data) => {
      if (data.isNewVisit) {
        // Update the cached visitor count with the new total
        queryClient.setQueryData(['visitor-count', collectionId], {
          visitorCount: data.totalVisitorCount
        });
      }
    },
    onError: (error) => {
      // Silently fail
      console.log('Visit tracking failed:', error);
    },
  });

  // Auto-track visit after 3 seconds
  useEffect(() => {
    if (!collectionId || hasTracked) return;

    const timer = setTimeout(() => {
      trackVisitMutation.mutate();
      setHasTracked(true);
    }, 3000); // 3 second delay

    return () => clearTimeout(timer);
  }, [collectionId, hasTracked, trackVisitMutation]);

  // Format visitor count for display
  const formatVisitorCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toLocaleString();
  };

  return {
    visitorCount: visitorData?.visitorCount || 0,
    formattedVisitorCount: visitorData ? formatVisitorCount(visitorData.visitorCount) : '0',
    isLoading,
    isTracking: trackVisitMutation.isPending,
  };
};