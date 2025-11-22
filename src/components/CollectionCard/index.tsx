import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ArtsyImagePlaceholder } from "@/components";

interface Collection {
    id: string;
    name: string;
    location: string;
    image_url?: string;
}

interface CollectionCardProps {
    collection: Collection;
    isActive?: boolean;
    onClick?: () => void;
    variant?: "mobile" | "desktop";
    mobileSize?: "small" | "large"; // small: 160x209, large: 207x256
}

const CollectionCard: React.FC<CollectionCardProps> = ({
    collection,
    isActive = false,
    onClick,
    variant = "desktop",
    mobileSize = "small",
}) => {
    const navigate = useNavigate();
    const isMobile = variant === "mobile";

    // Determine mobile dimensions
    const mobileDimensions =
        mobileSize === "large"
            ? "w-[207px] h-[256px] min-w-[207px]"
            : "w-[160px] h-[209px] min-w-[160px]";

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
        navigate(`/collections/${collection.id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={isMobile ? "flex-shrink-0" : ""}
            onClick={handleClick}
        >
            <Card
                className={`bg-white/10 backdrop-blur-sm border-0 overflow-hidden hover:bg-white/20 transition-all duration-300 cursor-pointer ${
                    isMobile ? "rounded-3xl" : ""
                }`}
            >
                <CardContent className={`p-0 ${isMobile ? "rounded-3xl" : ""}`}>
                    <div
                        className={`${
                            isMobile ? mobileDimensions : "aspect-[4/3]"
                        } relative group`}
                    >
                        {/* Image with Artsy Placeholder */}
                        <ArtsyImagePlaceholder
                            src={collection.image_url}
                            alt={collection.name}
                            name={collection.name}
                            variant="aspect-fill"
                            imageClassName="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-0"
                            className="absolute inset-0 z-0"
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10" />

                        {/* Yellow ring for active card (mobile only) */}
                        {isMobile && isActive && (
                            <div className="absolute inset-0 border-4 border-yellow-400 rounded-3xl z-20 pointer-events-none" />
                        )}

                        {/* Text Content */}
                        <div
                            className={`absolute ${
                                isMobile
                                    ? "bottom-5 left-5 right-5"
                                    : "bottom-5 left-5 right-5"
                            } z-30`}
                        >
                            <h3 className="text-yellow1 font-sf font-bold mb-1 text-xl line-clamp-2 leading-tight">
                                {collection.name}
                            </h3>
                            <div className="flex justify-between items-center">
                                <p className="text-white/80 font-inter text-sm">
                                    {collection.location}
                                </p>
                                <div className="text-white hover:bg-white/20 text-xs px-1 py-1 rounded cursor-pointer transition-colors">
                                    <ArrowUpRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default CollectionCard;
