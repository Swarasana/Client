import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion, PanInfo } from "framer-motion";
import { Search, Volume2 } from "lucide-react";
import { exhibitionsApi } from "@/api";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExhibitionCard } from "@/components";

import title from "@/assets/logos/title.png"
import topDecor from "@/assets/images/top-decor.png";
import anton from "@/assets/images/anton.png";
import dede from "@/assets/images/dede.png";
import eva from "@/assets/images/eva.png";


const Explore: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentSlide, setCurrentSlide] = useState(0);
    const autoScrollRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch exhibitions data
    const { data: exhibitionsData, isLoading } = useQuery({
        queryKey: ['exhibitions'],
        queryFn: () => exhibitionsApi.getAll({ cursor: null, limit: '8' }),
        retry: 3,
        staleTime: 5 * 60 * 1000,
    });

    const exhibitions = Array.isArray(exhibitionsData?.data) ? exhibitionsData.data : [];

    // Audio characters data - memoized
    const audioCharacters = useMemo(() => [
        { name: "Anton", avatar: anton, color: "bg-[#FFD942]" },
        { name: "Dede", avatar: dede, color: "bg-[#78C49E]" },
        { name: "Eva", avatar: eva, color: "bg-[#FFEBB2]" }
    ] as const, []);

    // Memoized calculations for carousel
    const carouselConfig = useMemo(() => {
        const CARD_WIDTH = 207;
        const CARD_GAP = 16;
        const SLIDE_WIDTH = CARD_WIDTH + CARD_GAP;
        const totalWidth = exhibitions.length * SLIDE_WIDTH - CARD_GAP;
        
        return {
            CARD_WIDTH,
            CARD_GAP,
            SLIDE_WIDTH,
            totalWidth,
            maxOffset: -(exhibitions.length - 1) * SLIDE_WIDTH
        };
    }, [exhibitions.length]);

    // Auto-scroll functionality
    useEffect(() => {
        if (exhibitions.length <= 1) return;

        autoScrollRef.current = window.setTimeout(() => {
            setCurrentSlide((prev) => {
                const nextSlide = prev + 1;
                // Loop back to first slide when reaching the end
                return nextSlide >= exhibitions.length ? 0 : nextSlide;
            });
        }, 10000); // 10 seconds

        return () => {
            if (autoScrollRef.current) {
                clearTimeout(autoScrollRef.current);
            }
        };
    }, [currentSlide, exhibitions.length]);


    const handleDragEnd = useCallback((_event: unknown, info: PanInfo) => {
        // Clear auto-scroll when user manually drags
        if (autoScrollRef.current) {
            clearTimeout(autoScrollRef.current);
            autoScrollRef.current = null;
        }

        const velocity = Math.abs(info.velocity.x);
        const offset = Math.abs(info.offset.x);
        
        // Simplified slide calculation for better performance
        const threshold = 80;
        const velocityThreshold = 300;
        
        if (offset > threshold || velocity > velocityThreshold) {
            if (info.offset.x > 0) {
                // Swipe right (previous)
                setCurrentSlide((prev) => prev > 0 ? prev - 1 : exhibitions.length - 1);
            } else {
                // Swipe left (next)  
                setCurrentSlide((prev) => (prev + 1) % exhibitions.length);
            }
        }
    }, [exhibitions.length]);

    const handleSearchSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    }, [searchQuery, navigate]);

    const handleSlideChange = useCallback((index: number) => {
        if (autoScrollRef.current) {
            clearTimeout(autoScrollRef.current);
            autoScrollRef.current = null;
        }
        setCurrentSlide(index);
    }, []);

    const SkeletonCard = useMemo(() => (
        <Card className="bg-white/10 backdrop-blur-sm border-0 overflow-hidden">
            <CardContent className="p-0">
                <div className="w-[207px] h-[256px] relative">
                    <Skeleton className="w-full h-full bg-white/20" />
                    <div className="absolute bottom-3 left-3 right-3 z-20">
                        <Skeleton className="h-4 w-3/4 bg-white/30 mb-2" />
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-3 w-1/2 bg-white/20" />
                            <Skeleton className="h-6 w-6 bg-white/20 rounded" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    ), []);

    return (
        <main className="flex flex-col w-full min-h-screen bg-gradient-to-b from-blue1 via-blue1 to-blue2 text-white relative overflow-hidden">
            {/* Background Awan Decoration */}
            <div className="absolute top-0 right-0 h-32">
                <img 
                    src={topDecor} 
                    alt="Swarasana Cloud" 
                    className="h-13 mb-2"
                />
            </div>

            <div className="relative z-10 p-4 pb-8">
                {/* Header */}
                <div className="flex flex-col items-start mt-2">
                    <img 
                        src={title}
                        alt="Swarasana" 
                        className="h-14 mb-2"
                    />
                </div>
                <div className="flex flex-col items-center mb-6 mt-2">    
                    {/* Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="w-full max-w-md relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 z-10" />
                        <Input
                            type="text"
                            placeholder="Eksplorasi pameran atau museum"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-white backdrop-blur-sm border-0 rounded-full font-sf font-light text-gray-800 placeholder-gray-500"
                        />
                    </form>
                </div>

                {/* Indonesian Heritage Section */}
                <div className="mb-8">
                    <h2 className="text-xl mb-4 text-yellow1 font-sf font-semibold">Jelajahi Pusaka Indonesia</h2>
                    
                    {/* Desktop Grid View */}
                    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {isLoading ? (
                            // Desktop Skeleton Loading
                            Array.from({ length: 8 }).map((_, index) => (
                                <div key={`desktop-skeleton-${index}`} className="bg-white/10 backdrop-blur-sm rounded-lg aspect-[4/3] animate-pulse" />
                            ))
                        ) : exhibitions.length > 0 ? exhibitions.map((exhibition, index) => (
                            <ExhibitionCard
                                key={exhibition.id}
                                exhibition={exhibition}
                                index={index}
                                variant="desktop"
                            />
                        )) : (
                            <div className="col-span-full text-center py-8">
                                <p className="text-white/70">No exhibitions found</p>
                            </div>
                        )}
                    </div>

                    {/* Mobile Sliding View */}
                    <div className="md:hidden relative">
                        {isLoading ? (
                            // Mobile Skeleton Loading
                            <div className="overflow-hidden">
                                <div className="flex gap-4">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <div key={index} className="min-w-[207px] flex-shrink-0">
                                            {SkeletonCard}
                                        </div>
                                    ))}
                                </div>
                                {/* Skeleton dot indicators */}
                                <div className="flex justify-center mt-4 gap-2">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <Skeleton key={index} className="w-2 h-2 rounded-full bg-white/30" />
                                    ))}
                                </div>
                            </div>
                        ) : exhibitions.length > 0 ? (
                            <div className="overflow-hidden" ref={containerRef}>
                                <motion.div
                                    className="flex gap-4 cursor-grab active:cursor-grabbing"
                                    drag="x"
                                    dragConstraints={{
                                        left: carouselConfig.maxOffset,
                                        right: 0
                                    }}
                                    dragElastic={0.15}
                                    dragTransition={{ bounceStiffness: 300, bounceDamping: 40 }}
                                    onDragEnd={handleDragEnd}
                                    animate={{ 
                                        x: -currentSlide * carouselConfig.SLIDE_WIDTH
                                    }}
                                    transition={{ 
                                        type: "spring", 
                                        stiffness: 400, 
                                        damping: 40,
                                        mass: 0.8
                                    }}
                                    style={{ 
                                        width: carouselConfig.totalWidth,
                                        willChange: 'transform'
                                    }}
                                >
                                    {exhibitions.map((exhibition, index) => (
                                        <ExhibitionCard
                                            key={exhibition.id}
                                            exhibition={exhibition}
                                            index={index}
                                            isActive={index === currentSlide}
                                            variant="mobile"
                                            mobileSize="large"
                                        />
                                    ))}
                                </motion.div>
                                
                                {/* Dot indicators */}
                                <div className="flex justify-center mt-4 gap-2">
                                    {exhibitions.map((_, index) => (
                                        <button
                                            key={index}
                                            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                                                index === currentSlide ? 'bg-yellow-400' : 'bg-white/30'
                                            }`}
                                            onClick={() => handleSlideChange(index)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-white/70">No exhibitions found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Audio Characters Section */}
                <div className="mb-8">
                    <h2 className="text-xl text-yellow1 font-sf font-semibold mb-5">Hidupkan Setiap Koleksi Lewat Suara</h2>
                
                    <div className="flex justify-center gap-6">
                        {isLoading ? (
                            // Audio Characters Skeleton Loading
                            Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <Skeleton className="w-24 h-24 rounded-full bg-white/20" />
                                    <Skeleton className="h-3 w-12 bg-white/20 mt-2" />
                                </div>
                            ))
                        ) : (
                            audioCharacters.map((character, index) => (
                            <motion.div
                                key={character.name}
                                className="flex flex-col items-center cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className={`w-24 h-24 md:w-24 md:h-24 ${character.color} rounded-full flex items-center justify-center text-2xl md:text-3xl mb-2 relative`}>
                                    <img 
                                        src={character.avatar} 
                                        alt={character.name}
                                        className="h-13 mb-2"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-white rounded-full flex items-center justify-center">
                                        <Volume2 className="w-6 h-6 text-gray-800 fill-gray-800" />
                                    </div>
                                </div>
                                <span className="font-sf font-semibold text-yellow1">{character.name}</span>
                            </motion.div>
                        ))
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Explore;