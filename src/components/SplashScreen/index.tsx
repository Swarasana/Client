import React from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
    isVisible: boolean;
    onAnimationComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isVisible, onAnimationComplete }) => {
    if (!isVisible) return null;

    return (
        <motion.div
            className="fixed inset-0 bg-[#015289] flex items-center justify-center z-[9999]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            onAnimationComplete={() => {
                setTimeout(onAnimationComplete, 3000);
            }}
        >
            <div className="flex flex-col items-center justify-center">
                {/* App Icon with Animation */}
                <motion.div
                    className="relative mb-[-3rem] z-[100]"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                    <motion.div
                        className="w-72 h-72 rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm relative"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <img 
                            src="/icon-512x512.png" 
                            alt="Swarasana" 
                            className="flex items-center justify-center w-full h-full object-contain"
                        />
                    </motion.div>
                    
                    {/* Animated rings around the icon */}
                    <motion.div
                        className="absolute -inset-4 border-2 border-white/30 rounded-full"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ 
                            scale: [0.8, 1.25, 1],
                            opacity: [0, 0.6, 0]
                        }}
                        transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut"
                        }}
                    />
                    <motion.div
                        className="absolute -inset-8 border-2 border-white/20 rounded-full"
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ 
                            scale: [0.6, 1.35, 1],
                            opacity: [0, 0.4, 0]
                        }}
                        transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut",
                            delay: 0.5
                        }}
                    />
                </motion.div>

                {/* Tagline */}
                <motion.p
                    className="text-white/90 text-lg font-light tracking-wide z-[200]"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
                >
                    Discover Cultural Heritage
                </motion.p>

                {/* Loading dots */}
                <motion.div
                    className="flex space-x-2 mt-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    {[0, 1, 2].map((index) => (
                        <motion.div
                            key={index}
                            className="w-2 h-2 bg-white/70 rounded-full"
                            animate={{
                                y: [0, -8, 0],
                                opacity: [0.7, 1, 0.7]
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: index * 0.2
                            }}
                        />
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SplashScreen;