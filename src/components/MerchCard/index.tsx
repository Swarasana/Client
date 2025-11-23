import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Merch } from "@/types";
import { Gift, QrCode } from "lucide-react";

interface MerchCardProps {
    merch: Merch;
}

const MerchCard: React.FC<MerchCardProps> = ({ merch }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-none w-full snap-start"
        >
            <Card className="bg-[#F0F0F0] h-full rounded-3xl p-4 transition-all duration-300 font-sf text-black">
                <CardContent className="p-0 flex flex-col h-full">
                    <div className="flex flex-col gap-2 h-full">
                        <div className="flex flex-col gap-0">
                            <div className="flex flex-row">
                                <h3 className="flex-grow font-semibold text-base leading-tight">
                                    {merch.name}
                                </h3>
                                <div className="flex flex-row items-center gap-1">
                                    <Gift className="w-4 h-4" />
                                    <p className="font-bold text-xs">
                                        {merch.price}
                                    </p>
                                </div>
                            </div>

                            <p className="text-xs text-neutral-500">
                                {merch.exhibition}
                            </p>
                        </div>

                        <div className="flex flex-row flex-grow w-full items-center">
                            <p className="flex-grow h-full font-light text-[11px] line-clamp-3">
                                {merch.desc}
                            </p>
                            <div className="flex items-center justify-center p-2.5 bg-yellow-400 rounded-full">
                                <QrCode className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default MerchCard;
