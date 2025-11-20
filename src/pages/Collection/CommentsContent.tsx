import React, { useState } from "react";
import { MessageSquare, Volume2, Sparkles, ThumbsUp, ThumbsDown, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Comment } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface CommentsContentProps {
  comments: Comment[];
  aiSummary: any;
  summaryLoading: boolean;
  onLikeComment: (commentId: string) => void;
  onAddComment: (commentData: { name: string; comment: string }) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

type CommentStep = 'collapsed' | 'list' | 'contribution' | 'form';

const CommentsContent: React.FC<CommentsContentProps> = ({ 
  comments, 
  aiSummary, 
  summaryLoading, 
  onLikeComment, 
  onAddComment, 
  isExpanded, 
  setIsExpanded 
}) => {
  const [currentStep, setCurrentStep] = useState<CommentStep>('collapsed');
  const [previousStep, setPreviousStep] = useState<CommentStep>('collapsed');
  const [newComment, setNewComment] = useState({ name: '', comment: '' });
  const [isAnonymous, _] = useState(false);

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

  const aiSummaryText = aiSummary?.text || "Seru banget melihat miniatur ini, bikin aku ngerasa kalau Gedung Sate yang megah sekarang ternyata dulunya dibangun dengan detail yang rumit dan tahap...";

  const handleSubmitComment = () => {
    if (newComment.comment.trim()) {
      // Pass the comment data to the parent component
      onAddComment(newComment);
      setNewComment({ name: '', comment: '' });
      navigateToStep('list');
    }
  };

  const resetSteps = () => {
    setPreviousStep(currentStep);
    setCurrentStep('collapsed');
    setIsExpanded(false);
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
                <div className="flex items-center mb-2">
                  <Sparkles className="w-4 h-4 mr-2 text-teal-600" />
                  <span className="text-sm font-sf font-semibold text-teal-600">AI Summary</span>
                  <Button variant="ghost" size="sm" className="ml-auto text-yellow-400 p-1">
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                  {aiSummaryText}
                </p>
                <span className="text-gray-500 text-sm">...</span>
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
              onLikeComment={onLikeComment}
              onContribute={() => navigateToStep('contribution')}
              onBack={(target) => navigateToStep(target)}
              newComment={newComment}
              setNewComment={setNewComment}
              isAnonymous={isAnonymous}
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
              onLikeComment={onLikeComment}
              onContribute={() => navigateToStep('contribution')}
              onBack={(target) => navigateToStep(target)}
              newComment={newComment}
              setNewComment={setNewComment}
              isAnonymous={isAnonymous}
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
  onContribute: () => void;
  onBack: (target: CommentStep) => void;
  newComment: { name: string; comment: string };
  setNewComment: React.Dispatch<React.SetStateAction<{ name: string; comment: string }>>;
  isAnonymous: boolean;
  handleSubmitComment: () => void;
}>(({ 
  currentStep,
  previousStep: _,
  direction,
  aiSummaryText, 
  summaryLoading, 
  comments, 
  onLikeComment, 
  onContribute, 
  onBack,
  newComment,
  setNewComment,
  isAnonymous,
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
              className="w-full p-4 bg-blue2 hover:bg-blue2/80 text-white rounded-lg"
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
              <span className="underline">Buat akun di sini</span> untuk dapatkan hadiah menarik atau
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
              className="w-full p-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg"
            >
              <div className="text-center">
                <div className="font-sf font-semibold text-lg">Komentar tanpa Akun?</div>
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
              value={newComment.name}
              onChange={(e) => setNewComment(prev => ({ ...prev, name: e.target.value }))}
              placeholder=""
              className="w-full p-3 bg-gray-100 border-none rounded-lg"
            />
            {isAnonymous && (
              <p className="text-sm text-gray-500 mt-2">Klik untuk jadi anonim</p>
            )}
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
              className="w-full p-3 bg-gray-100 border-none rounded-lg h-32 resize-none"
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
              className="w-full p-4 bg-blue2 hover:bg-blue2/80 text-white rounded-lg font-sf font-semibold text-lg"
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
  onContribute: () => void;
}> = ({ aiSummaryText, summaryLoading, comments, onLikeComment, onContribute }) => (
  <div className="flex flex-col h-full">
    <div className="flex-1 overflow-y-auto p-6 pb-0" style={{ minHeight: 0 }}>
      {/* AI Summary */}
      <motion.div 
        className="mb-6 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
      <div className="flex items-center justify-between w-full mb-2">
        <div className="flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-teal-600" />
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
            <Volume2 className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
      {summaryLoading ? (
        <div className="h-16 bg-gray-200 animate-pulse rounded" />
      ) : (
        <motion.p 
          className="text-gray-700 text-sm leading-relaxed"
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
            className="bg-gray-50 rounded-lg p-4"
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
                <Volume2 className="w-4 h-4 text-gray-400" />
              </motion.div>
            </div>
            <p className="text-gray-700 text-sm mb-3 leading-relaxed">
              {comment.comment_text}
            </p>
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => onLikeComment(comment.id)}
                className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">{comment.likes_count || 0}</span>
              </motion.button>
              <motion.button 
                className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ThumbsDown className="w-4 h-4" />
                <span className="text-sm">0</span>
              </motion.button>
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
            <p className="text-sm">Belum ada komentar. Jadilah yang pertama!</p>
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
          className="w-full p-4 bg-blue2 hover:bg-blue2/80 text-white rounded-lg font-sf font-semibold text-base"
        >
          Kontribusi
        </Button>
      </motion.div>
      
      <motion.div 
        className="text-center mt-3"
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