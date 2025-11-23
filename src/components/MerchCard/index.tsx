import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Merch } from "@/types";
import { Gift, QrCode } from "lucide-react";

interface MerchCardProps {
    merch: Merch;
}

const MerchCard: React.FC<MerchCardProps> = ({ merch }) => {

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-none w-full snap-start"
        >
            <Card className="bg-[#F0F0F0] h-full rounded-3xl p-4 transition-all duration-300 font-sf text-black cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                <CardContent className="p-0 flex flex-col h-full">
                    <div className="flex flex-col gap-3 h-full">
                        <div className="flex flex-col gap-1 min-h-[3.5rem]">
                            <div className="flex flex-row items-start gap-2 min-h-[2.5rem]">
                                <h3 className="flex-grow font-semibold text-base leading-tight line-clamp-2">
                                    {merch.name}
                                </h3>
                                <div className="flex flex-row items-center gap-1 flex-shrink-0">
                                    <Gift className="w-4 h-4" />
                                    <p className="font-bold text-xs">
                                        {merch.price}
                                    </p>
                                </div>
                            </div>

                            <p className="font-medium text-xs text-neutral-500">
                                {merch.exhibition}
                            </p>
                        </div>

                        <div className="flex flex-row flex-grow w-full items-center gap-3">
                            <p className="flex-grow text-sm line-clamp-3 leading-relaxed text-neutral-700">
                                {merch.desc}
                            </p>
                            <motion.div 
                                className="flex items-center justify-center p-2.5 bg-yellow-400 rounded-full transition-colors hover:bg-yellow-500 flex-shrink-0"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <QrCode className="w-5 h-5" />
                            </motion.div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default MerchCard;
