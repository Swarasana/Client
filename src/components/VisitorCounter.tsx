import React from 'react';
import { Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface VisitorCounterProps {
  visitorCount: number;
  formattedVisitorCount: string;
  isLoading: boolean;
  className?: string;
}

const VisitorCounter: React.FC<VisitorCounterProps> = ({
  visitorCount,
  formattedVisitorCount,
  isLoading,
  className = ""
}) => {
  if (isLoading) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <Skeleton className="w-4 h-4" />
        <Skeleton className="h-4 w-16" />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 text-white/80 ${className}`}>
      <Eye className="w-4 h-4" />
      <span className="text-sm font-sf font-light">
        {formattedVisitorCount} {visitorCount === 1 ? 'visitor' : 'visitors'}
      </span>
    </div>
  );
};

export default VisitorCounter;