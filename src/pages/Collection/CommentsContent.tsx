import React, { useState } from "react";
import { MessageSquare, Volume2, Sparkles, ThumbsUp, ThumbsDown, ArrowLeft } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Comment } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateTime } from "@/lib/utils";
import { collectionsApi, commentsApi } from "@/api";
import { useToast } from "@/hooks/use-toast";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface CommentsContentProps {
  collectionId: string;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

type CommentStep = 'collapsed' | 'list' | 'contribution' | 'form';

const CommentsContent: React.FC<CommentsContentProps> = ({ 
  collectionId,
  isExpanded, 
  setIsExpanded 
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Internal state management - now self-contained
  const [currentStep, setCurrentStep] = useState<CommentStep>('collapsed');
  const [previousStep, setPreviousStep] = useState<CommentStep>('collapsed');
  const [newComment, setNewComment] = useState({ name: '', comment: '' });
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [dislikedComments, setDislikedComments] = useState<Set<string>>(new Set());

  // Fetch comments for this collection
  const { data: commentsData } = useQuery({
    queryKey: ['collection-comments', collectionId],
    queryFn: () => collectionsApi.getComments(collectionId, { cursor: null, limit: '10' }),
    enabled: !!collectionId,
    retry: 3,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch AI Summary
  const { data: aiSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ['collection-ai-summary', collectionId],
    queryFn: () => collectionsApi.getAISummary(collectionId),
    enabled: !!collectionId,
    retry: 3,
    staleTime: 10 * 60 * 1000,
  });

  // React Query mutations
  const addCommentMutation = useMutation({
    mutationFn: async (commentData: { name: string; comment: string }) => {
      if (!collectionId) throw new Error('No collection ID');
      return collectionsApi.addComment(collectionId, {
        username: commentData.name || null,
        user_pic_url: null,
        comment_text: commentData.comment
      });
    },
    onSuccess: () => {
      toast({
        title: "Komentar terkirim!",
        description: "Terima kasih atas kontribusi Anda",
        duration: 2000,
      });
      // Invalidate comments to refresh the list
      queryClient.invalidateQueries({ queryKey: ['collection-comments', collectionId] });
    },
    onError: (error) => {
      console.error('Error submitting comment:', error);
      toast({
        title: "Gagal mengirim komentar",
        description: "Silakan coba lagi",
        variant: "destructive",
        duration: 2000,
      });
    }
  });

  const likeCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      return commentsApi.like(commentId);
    },
    onSuccess: () => {
      toast({
        title: "Komentar disukai!",
        description: "Terima kasih atas apresiasi Anda",
        duration: 2000,
      });
      // Invalidate comments to refresh like counts immediately
      queryClient.invalidateQueries({ queryKey: ['collection-comments', collectionId] });
    },
    onError: (error) => {
      console.error('Error liking comment:', error);
      toast({
        title: "Gagal menyukai komentar",
        description: "Silakan coba lagi",
        variant: "destructive",
        duration: 2000,
      });
    }
  });

  const handleCommentSubmit = async (commentData: { name: string; comment: string }) => {
    addCommentMutation.mutate(commentData);
  };

  const handleLikeComment = (commentId: string) => {
    likeCommentMutation.mutate(commentId);
  };
  
  const comments = (commentsData?.data || []) as unknown as Comment[];
  const aiSummaryText = aiSummary?.text || '';

  // Navigation direction tracking
  const getDirection = (from: CommentStep, to: CommentStep): 'forward' | 'back' => {
    const stepOrder: CommentStep[] = ['collapsed', 'list', 'contribution', 'form'];
    const fromIndex = stepOrder.indexOf(from);
    const toIndex = stepOrder.indexOf(to);
    return toIndex > fromIndex ? 'forward' : 'back';
  };

  const navigateToStep = (step: CommentStep) => {
    setPreviousStep(currentStep);
    setCurrentStep(step);
  };

  const handleSubmitComment = () => {
    if (newComment.comment.trim()) {
      handleCommentSubmit(newComment);
      setNewComment({ name: '', comment: '' });
      navigateToStep('list');
    }
  };

  const resetSteps = () => {
    setPreviousStep(currentStep);
    setCurrentStep('collapsed');
    setIsExpanded(false);
  };

  const handleLikeCommentClick = (commentId: string) => {
    handleLikeComment(commentId);
    setLikedComments(prev => new Set(prev).add(commentId));
    setDislikedComments(prev => {
      const newSet = new Set(prev);
      newSet.delete(commentId);
      return newSet;
    });
  };

  const handleDislikeComment = (commentId: string) => {
    setDislikedComments(prev => new Set(prev).add(commentId));
    setLikedComments(prev => {
      const newSet = new Set(prev);
      newSet.delete(commentId);
      return newSet;
    });
  };

  const isOpen = currentStep !== 'collapsed';

  return (
    <>
      {/* Collapsed Trigger */}
      {currentStep === 'collapsed' && (
        <Drawer open={isExpanded} onOpenChange={(open) => {
          setIsExpanded(open);
          if (open) navigateToStep('list');
          else resetSteps();
        }}>
          <DrawerTrigger asChild>
            <div className="text-gray-900 h-full flex flex-col cursor-pointer">
              {/* Header */}
              <div className="flex items-center mb-3">
                <MessageSquare className="w-5 h-5 mr-2 text-gray-700" />
                <h2 className="text-lg font-sf font-bold">Komentar Pengunjung</h2>
              </div>
              
              {/* AI Summary Preview */}
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <Sparkles className="w-4 h-4 mr-2 text-teal-600 fill-teal-600" />
                  <span className="text-base font-sf font-semibold text-teal-600">AI Summary</span>
                  <Button 
                    size="sm" 
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full p-2 ml-auto"
                  >
                    <Volume2 className="w-4 h-4 fill-gray-900" />
                  </Button>
                </div>
                {summaryLoading || !aiSummaryText ? (
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-gradient-to-r from-teal-100 via-gray-100 to-gray-50 animate-pulse" />
                    <div className="h-4 w-full rounded bg-gradient-to-r from-teal-100 via-gray-100 to-gray-50 animate-pulse" />
                    <div className="h-4 w-3/4 rounded bg-gradient-to-r from-teal-100 via-gray-100 to-gray-50 animate-pulse" />
                  </div>
                ) : (
                  <>
                    <p className="text-gray-700 text-base font-sf font-light line-clamp-3">
                      {aiSummaryText}
                    </p>
                    <span className="text-gray-500 text-sm">...</span>
                  </>
                )}
              </div>
            </div>
          </DrawerTrigger>

          <DrawerContent className="h-[85vh] max-h-[85vh]">
            <DrawerContentRenderer 
              currentStep="list"
              previousStep="collapsed"
              direction="forward"
              aiSummaryText={aiSummaryText}
              summaryLoading={summaryLoading}
              comments={comments}
              onLikeComment={handleLikeCommentClick}
              onDislikeComment={handleDislikeComment}
              likedComments={likedComments}
              dislikedComments={dislikedComments}
              onContribute={() => navigateToStep('contribution')}
              onBack={(target) => navigateToStep(target)}
              newComment={newComment}
              setNewComment={setNewComment}
              isAnonymous={isAnonymous}
              setIsAnonymous={setIsAnonymous}
              handleSubmitComment={handleSubmitComment}
            />
          </DrawerContent>
        </Drawer>
      )}

      {/* Single Drawer for all expanded states */}
      <Drawer open={isOpen} onOpenChange={(open) => {
        if (!open) resetSteps();
      }}>
        <DrawerContent className="h-[85vh] max-h-[85vh]">
          <AnimatePresence mode="popLayout">
            <DrawerContentRenderer 
              key={currentStep}
              currentStep={currentStep}
              previousStep={previousStep}
              direction={getDirection(previousStep, currentStep)}
              aiSummaryText={aiSummaryText}
              summaryLoading={summaryLoading}
              comments={comments}
              onLikeComment={handleLikeCommentClick}
              onDislikeComment={handleDislikeComment}
              likedComments={likedComments}
              dislikedComments={dislikedComments}
              onContribute={() => navigateToStep('contribution')}
              onBack={(target) => navigateToStep(target)}
              newComment={newComment}
              setNewComment={setNewComment}
              isAnonymous={isAnonymous}
              setIsAnonymous={setIsAnonymous}
              handleSubmitComment={handleSubmitComment}
            />
          </AnimatePresence>
        </DrawerContent>
      </Drawer>
    </>
  );
};

// Content renderer for different drawer states
const DrawerContentRenderer = React.forwardRef<HTMLDivElement, {
  currentStep: CommentStep;
  previousStep: CommentStep;
  direction: 'forward' | 'back';
  aiSummaryText: string;
  summaryLoading: boolean;
  comments: Comment[];
  onLikeComment: (id: string) => void;
  onDislikeComment: (id: string) => void;
  likedComments: Set<string>;
  dislikedComments: Set<string>;
  onContribute: () => void;
  onBack: (target: CommentStep) => void;
  newComment: { name: string; comment: string };
  setNewComment: React.Dispatch<React.SetStateAction<{ name: string; comment: string }>>;
  isAnonymous: boolean;
  setIsAnonymous: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmitComment: () => void;
}>(({ 
  currentStep,
  previousStep: _,
  direction,
  aiSummaryText, 
  summaryLoading, 
  comments, 
  onLikeComment,
  onDislikeComment,
  likedComments,
  dislikedComments,
  onContribute, 
  onBack,
  newComment,
  setNewComment,
  isAnonymous,
  setIsAnonymous,
  handleSubmitComment
}, _ref) => {
  // Animation variants based on direction - only entrance animation
  const getAnimationProps = () => {
    if (direction === 'forward') {
      return {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 }
      };
    } else {
      return {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 }
      };
    }
  };

  const animationProps = getAnimationProps();
  if (currentStep === 'list') {
    return (
      <motion.div
        key="list"
        initial={animationProps.initial}
        animate={animationProps.animate}
        transition={{ duration: 0.2 }}
        className="flex flex-col h-full"
      >
        <DrawerHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between w-full pl-3">
            <div className="flex items-center">
              <MessageSquare className="w-6 h-6 mr-3 text-gray-700" />
              <DrawerTitle className="text-xl font-sf font-bold text-gray-900">
                Komentar Pengunjung
              </DrawerTitle>
            </div>
          </div>
          <DrawerDescription className="sr-only">
            Daftar komentar pengunjung untuk koleksi ini
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 flex flex-col overflow-hidden">
          <CommentsList 
            aiSummaryText={aiSummaryText}
            summaryLoading={summaryLoading}
            comments={comments}
            onLikeComment={onLikeComment}
            onDislikeComment={onDislikeComment}
            likedComments={likedComments}
            dislikedComments={dislikedComments}
            onContribute={onContribute}
          />
        </div>
      </motion.div>
    );
  }

  if (currentStep === 'contribution') {
    return (
      <motion.div
        key="contribution"
        initial={animationProps.initial}
        animate={animationProps.animate}
        transition={{ duration: 0.2 }}
        className="flex flex-col h-full"
      >
        <DrawerHeader className="border-b border-gray-100">
          <div className="flex items-center w-full">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBack('list')}
                className="mr-3 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </motion.div>
            <div className="flex items-center">
              <MessageSquare className="w-6 h-6 mr-3 text-gray-700" />
              <DrawerTitle className="text-xl font-sf font-bold text-gray-900">
                Kontribusi Pada Karya Ini
              </DrawerTitle>
            </div>
          </div>
          <DrawerDescription className="sr-only">
            Pilih cara berkontribusi
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => onBack('form')}
              className="w-full p-4 py-6 bg-blue2 hover:bg-blue2/80 text-white rounded-full"
            >
              <div className="text-center">
                <div className="font-sf font-semibold text-lg">Login</div>
              </div>
            </Button>
          </motion.div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <p className="text-base text-gray-900 font-sf">
              <span className="underline font-bold">Buat akun di sini</span> untuk dapatkan hadiah menarik atau
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => onBack('form')}
              className="w-full p-4 py-6 bg-yellow-400 hover:bg-yellow-600 text-gray-900 rounded-full"
            >
              <div className="text-center">
                <div className="font-sf font-semibold text-lg">Komentar tanpa Akun</div>
              </div>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (currentStep === 'form') {
    return (
      <motion.div
        key="form"
        initial={animationProps.initial}
        animate={animationProps.animate}
        transition={{ duration: 0.2 }}
        className="flex flex-col h-full"
      >
        <DrawerHeader className="border-b border-gray-100">
          <div className="flex items-center w-full">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBack('contribution')}
                className="mr-3 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </motion.div>
            <div className="flex items-center">
              <MessageSquare className="w-6 h-6 mr-3 text-gray-700" />
              <DrawerTitle className="text-xl font-sf font-bold text-gray-900">
                Kontribusi Pada Karya Ini
              </DrawerTitle>
            </div>
          </div>
          <DrawerDescription className="sr-only">
            Form untuk mengirim komentar
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <label className="block text-base font-sf font-semibold text-gray-900 mb-3">
              Nama
            </label>
            <Input
              value={isAnonymous ? '' : newComment.name}
              onChange={(e) => setNewComment(prev => ({ ...prev, name: e.target.value }))}
              placeholder=""
              disabled={isAnonymous}
              className={`w-full p-3 border-none rounded-2xl ${
                isAnonymous ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-100'
              }`}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="flex items-center space-x-2"
          >
            <Checkbox 
              id="anonymous" 
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
              className="border-gray-400"
            />
            <label 
              htmlFor="anonymous" 
              className="text-sm text-gray-600 font-sf cursor-pointer"
            >
              Klik untuk jadi anonim
            </label>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <label className="block text-base font-sf font-semibold text-gray-900 mb-3">
              Komentar
            </label>
            <Textarea
              value={newComment.comment}
              onChange={(e) => setNewComment(prev => ({ ...prev, comment: e.target.value }))}
              placeholder=""
              className="w-full p-3 font-sf font-regular bg-gray-100 border-none rounded-2xl h-32 resize-none"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => {
                handleSubmitComment();
                onBack('list');
              }}
              disabled={!newComment.comment.trim()}
              className="w-full p-4 py-6 bg-blue2 hover:bg-blue2/80 text-white rounded-full font-sf font-semibold text-lg"
            >
              Kirim
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return null;
});

DrawerContentRenderer.displayName = 'DrawerContentRenderer';

// Helper component for comments list
const CommentsList: React.FC<{
  aiSummaryText: string;
  summaryLoading: boolean;
  comments: Comment[];
  onLikeComment: (id: string) => void;
  onDislikeComment: (id: string) => void;
  likedComments: Set<string>;
  dislikedComments: Set<string>;
  onContribute: () => void;
}> = ({ aiSummaryText, summaryLoading, comments, onLikeComment, onDislikeComment, likedComments, dislikedComments, onContribute }) => (
  <div className="flex flex-col h-full">
    <div className="flex-1 overflow-y-auto p-6 pb-0" style={{ minHeight: 0 }}>
      {/* AI Summary */}
      <motion.div 
        className="mb-6 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl border border-teal-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
      <div className="flex items-center justify-between w-full mb-2">
        <div className="flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-teal-600 fill-teal-600" />
          <span className="text-base font-sf font-semibold text-teal-600">AI Summary</span>
        </div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button 
            size="sm" 
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full p-2"
          >
            <Volume2 className="w-4 h-4 fill-gray-900" />
          </Button>
        </motion.div>
      </div>
      {summaryLoading || !aiSummaryText ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      ) : (
        <motion.p 
          className="text-gray-700 text-base font-sf font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {aiSummaryText}
        </motion.p>
      )}
    </motion.div>

    {/* Comments */}
    <motion.div 
      className="space-y-4 mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <AnimatePresence mode="popLayout">
        {comments.length > 0 ? comments.map((comment, index) => (
          <motion.div 
            key={comment.id} 
            className="bg-gray-50 rounded-2xl p-4"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(243, 244, 246, 0.8)" }}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="font-sf font-medium text-gray-900 text-base">
                {comment.username || 'Anonim'}
              </span>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Volume2 className="w-4 h-4 text-gray-400 fill-gray-400" />
              </motion.div>
            </div>
            <p className="text-gray-700 text-base mb-3 font-sf font-light">
              {comment.comment_text}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => onLikeComment(comment.id)}
                  className={`flex items-center gap-2 transition-colors ${
                    likedComments.has(comment.id) 
                      ? 'text-blue-600' 
                      : 'text-gray-500 hover:text-blue-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ThumbsUp 
                    className="w-4 h-4" 
                    fill={likedComments.has(comment.id) ? 'currentColor' : 'none'}
                  />
                  <span className="text-sm">{comment.likes_count || 0}</span>
                </motion.button>
                <motion.button 
                  onClick={() => onDislikeComment(comment.id)}
                  className={`flex items-center gap-2 transition-colors ${
                    dislikedComments.has(comment.id) 
                      ? 'text-red-600' 
                      : 'text-gray-500 hover:text-red-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ThumbsDown 
                    className="w-4 h-4" 
                    fill={dislikedComments.has(comment.id) ? 'currentColor' : 'none'}
                  />
                </motion.button>
              </div>
              
              {/* Date/Time */}
              <span className="text-xs text-gray-400 font-sf">
                {formatDateTime(comment.created_at)}
              </span>
            </div>
          </motion.div>
        )) : (
          <motion.div 
            className="text-center py-8 text-gray-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", bounce: 0.3 }}
            >
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            </motion.div>
            <p className="text-sm font-sf font-light">Belum ada komentar. Jadilah yang pertama!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </div>

    {/* Fixed Bottom Section - Kontribusi Button */}
    <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-100 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={onContribute}
          className="w-full p-4 py-6 bg-blue2 hover:bg-blue2/80 text-white rounded-full font-sf font-semibold text-base"
        >
          Kontribusi
        </Button>
      </motion.div>
      
      <motion.div 
        className="text-center my-4 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <p className="text-sm text-gray-500 font-sf">
          Bagikan pendapat dan ceritamu tentang koleksi ini
        </p>
      </motion.div>
    </div>
  </div>
);

export default CommentsContent;