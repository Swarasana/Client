import React from "react";
import { MessageSquare, ChevronUp, Volume2, Sparkles, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Comment } from "@/types";

interface CommentsContentProps {
  comments: Comment[];
  aiSummary: any;
  summaryLoading: boolean;
  onLikeComment: (commentId: string) => void;
  onAddComment: () => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

const CommentsContent: React.FC<CommentsContentProps> = ({ 
  comments, 
  aiSummary, 
  summaryLoading, 
  onLikeComment, 
  onAddComment, 
  isExpanded, 
  setIsExpanded 
}) => (
  <div className="text-gray-900 h-full flex flex-col">
    {/* Header - Fixed */}
    <div className="flex items-center justify-between mb-4 flex-shrink-0">
      <h2 className="text-lg font-sf font-bold flex items-center">
        <MessageSquare className="w-4 h-4 mr-2" />
        Komentar Pengunjung
      </h2>
      <div className="flex items-center">
        <Volume2 className="w-3 h-3 text-yellow-500 mr-2" />
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronUp className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>

    {/* Content - Scrollable */}
    <div className="flex-1 overflow-y-auto mb-4">
      {/* AI Summary */}
      <div className="mb-4 p-3 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-100">
        <div className="flex items-center mb-2">
          <Sparkles className="w-4 h-4 mr-2 text-teal-600" />
          <span className="text-sm font-sf font-semibold text-teal-600">AI Summary</span>
          <Button variant="ghost" size="sm" className="ml-auto text-yellow-500 p-1">
            <Volume2 className="w-3 h-3" />
          </Button>
        </div>
        {summaryLoading ? (
          <div className="h-10 bg-gray-200 animate-pulse rounded" />
        ) : (
          <p className="text-gray-700 text-xs leading-relaxed">
            {aiSummary?.text || "Seru banget melihat miniatur ini, bikin aku ngerasa kalau Gedung Sate yang megah sekarang ternyata dulunya dibangun dengan detail yang rumit dan tahap..."}
          </p>
        )}
      </div>

      {/* Comments - Show more when expanded */}
      <div className="space-y-2">
        {comments.length > 0 ? comments.slice(0, isExpanded ? comments.length : 2).map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-start justify-between mb-1">
              <span className="font-sf font-medium text-gray-900 text-sm">
                {comment.username || 'Anonim'}
              </span>
              <Volume2 className="w-3 h-3 text-gray-400" />
            </div>
            <p className={`text-gray-700 text-xs mb-2 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
              {comment.comment_text}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onLikeComment(comment.id)}
                className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <ThumbsUp className="w-3 h-3" />
                <span className="text-xs">{comment.likes_count || 0}</span>
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-4 text-gray-500">
            <p className="text-xs">Belum ada komentar. Jadilah yang pertama!</p>
          </div>
        )}
        
        {/* Show more indicator when not expanded and there are more comments */}
        {!isExpanded && comments.length > 2 && (
          <div className="text-center py-2">
            <button
              onClick={() => setIsExpanded(true)}
              className="text-blue-600 hover:text-blue-800 text-xs font-sf"
            >
              Lihat {comments.length - 2} komentar lainnya
            </button>
          </div>
        )}
      </div>
    </div>

    {/* Add Comment Button - Fixed at bottom */}
    <Button
      onClick={onAddComment}
      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-sf py-2 rounded-lg text-sm flex-shrink-0"
    >
      Kontribusi
    </Button>
  </div>
);

export default CommentsContent;