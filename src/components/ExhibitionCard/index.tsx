import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Exhibition {
  id: string;
  name: string;
  description: string;
  location: string;
  image_url?: string;
}

interface ExhibitionCardProps {
  exhibition: Exhibition;
  index?: number;
  isActive?: boolean;
  onClick?: () => void;
  variant?: "mobile" | "desktop";
}

const ExhibitionCard: React.FC<ExhibitionCardProps> = ({
  exhibition,
  index = 0,
  isActive = false,
  onClick,
  variant = "desktop"
}) => {
  const isMobile = variant === "mobile";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={isMobile ? "min-w-[160px] flex-shrink-0" : ""}
      onClick={onClick}
    >
      <Card className={`bg-white/10 backdrop-blur-sm border-0 overflow-hidden hover:bg-white/20 transition-all duration-300 cursor-pointer ${
        isMobile ? "rounded-3xl" : ""
      }`}>
        <CardContent className={`p-0 ${isMobile ? "rounded-3xl" : ""}`}>
          <div className={`${
            isMobile ? "w-[160px] h-[209px]" : "aspect-[4/3]"
          } bg-gray-200 relative group`}>
            {/* Image */}
            <img 
              src={exhibition.image_url || "https://placehold.co/207x256"} 
              alt={exhibition.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Yellow ring for active card (mobile only) */}
            {isMobile && isActive && (
              <div className="absolute inset-0 border-4 border-yellow-400 rounded-3xl z-10 pointer-events-none" />
            )}

            {/* Text Content */}
            <div className={`absolute ${isMobile ? "bottom-5 left-5 right-5" : "bottom-5 left-5 right-5"} z-20`}>
              <h3 className="text-yellow1 font-sf font-bold mb-1 text-xl line-clamp-2 leading-tight">
                {exhibition.name}
              </h3>
              <div className="flex justify-between items-center">
                <p className="text-white/80 font-inter text-sm">{exhibition.location}</p>
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

export default ExhibitionCard;