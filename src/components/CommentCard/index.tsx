import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import trophy from "@/assets/images/trophy.svg";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { UserComment } from "@/types";

interface CommentCardProps {
    comment: UserComment;
    className: string;
    onClick?: () => void;
}

const CommentCard: React.FC<CommentCardProps> = ({
    comment,
    className,
    onClick,
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
        navigate(`/collection/${comment.collection_id}`);
    };

    const handleLikeCommentClick = (_commentId: string) => {
        //
    };

    const handleDislikeCommentClick = (_commentId: string) => {
        //
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${className} flex-none w-[320px] snap-start`}
            onClick={handleClick}
        >
            <Card
                className="bg-white h-full rounded-3xl p-4 transition-all duration-300 font-sf text-black cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                onClick={handleClick}
            >
                <CardContent className="p-0 flex flex-col h-full">
                    <div className="flex flex-col gap-3 h-full">
                        <div className="flex flex-col gap-1 min-h-[3.5rem]">
                            <div className="flex flex-row items-start gap-2 min-h-[2.5rem]">
                                <h3 className="flex-grow font-semibold text-base leading-tight line-clamp-2">
                                    {comment.collection_name}
                                </h3>
                                <div className="flex flex-row items-center gap-1 rounded-full bg-yellow-400 px-2 py-1 flex-shrink-0">
                                    <img
                                        src={trophy}
                                        alt="Poin"
                                        className="w-3 h-3"
                                    />
                                    <p className="font-bold text-xs">10</p>
                                </div>
                            </div>

                            <p className="font-medium text-xs text-neutral-500">
                                {comment.exhibition_name}
                            </p>
                        </div>

                        <p className="flex-grow text-sm line-clamp-3 leading-relaxed text-neutral-700">
                            {comment.comment_text}
                        </p>

                        <div className="flex items-center gap-3">
                            <motion.button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLikeCommentClick(comment.id);
                                }}
                                className="flex items-center gap-1.5 transition-colors text-gray-400 hover:text-red-500"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <ThumbsUp className="w-4 h-4" />
                                <span className="text-xs font-medium">
                                    {comment.likes_count || 0}
                                </span>
                            </motion.button>
                            <motion.button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDislikeCommentClick(comment.id);
                                }}
                                className="flex items-center gap-1.5 transition-colors text-gray-400 hover:text-blue-500"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <ThumbsDown className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default CommentCard;
