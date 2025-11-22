import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import trophy from "@/assets/images/trophy.svg";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { UserComment } from "@/types";

interface CommentCardProps {
    comment: UserComment;
    onClick?: () => void;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, onClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
        navigate(`/collection/${comment.collection_id}`);
    };

    const handleLikeCommentClick = (commentId: string) => {
        //
    };

    const handleDislikeCommentClick = (commentId: string) => {
        //
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-none w-[320px] snap-start"
            onClick={handleClick}
        >
            <Card
                className="bg-white h-full rounded-3xl p-4 hover:bg-white/20 transition-all duration-300 font-sf text-black"
                onClick={handleClick}
            >
                <CardContent className="p-0 flex flex-col h-full">
                    <div className="flex flex-col gap-2 h-full">
                        <div className="flex flex-col gap-0">
                            <div className="flex flex-row">
                                <h3 className="flex-grow font-semibold text-base leading-tight">
                                    {comment.collection_name}
                                </h3>
                                <div className="flex flex-row items-center gap-1 rounded-full bg-yellow-400 px-2 py-1">
                                    <img
                                        src={trophy}
                                        alt="Poin"
                                        className="w-3 h-3"
                                    />
                                    <p className="font-bold text-xs">10</p>
                                </div>
                            </div>

                            <p className="font-semibold text-xs text-neutral-500">
                                {comment.exhibition_name}
                            </p>
                        </div>

                        <p className=" flex-grow h-full text-xs line-clamp-3">
                            {comment.comment_text}
                        </p>

                        <div className="flex items-center gap-4">
                            <motion.button
                                onClick={() =>
                                    handleLikeCommentClick(comment.id)
                                }
                                //   className={`flex items-center gap-2 transition-colors ${
                                //     likedComments.has(comment.id)
                                //       ? 'text-blue-600'
                                //       : 'text-gray-500 hover:text-blue-600'
                                //   }`}
                                className="flex items-center gap-2 transition-colors text-gray-500 hover:text-blue-600"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ThumbsUp
                                    className="w-4 h-4"
                                    fill={
                                        /*likedComments.has(comment.id) ? 'currentColor' : */ "none"
                                    }
                                />
                                <span className="text-sm">
                                    {comment.likes_count || 0}
                                </span>
                            </motion.button>
                            <motion.button
                                onClick={() =>
                                    handleDislikeCommentClick(comment.id)
                                }
                                //   className={`flex items-center gap-2 transition-colors ${
                                //     dislikedComments.has(comment.id)
                                //       ? 'text-red-600'
                                //       : 'text-gray-500 hover:text-red-600'
                                //   }`}
                                className="flex items-center gap-2 transition-colors text-gray-500 hover:text-red-600"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ThumbsDown
                                    className="w-4 h-4"
                                    fill={
                                        /*dislikedComments.has(comment.id) ? 'currentColor' : */ "none"
                                    }
                                />
                            </motion.button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default CommentCard;
