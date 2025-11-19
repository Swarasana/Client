import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, PanInfo } from "framer-motion";
import { Search, Volume2, ArrowUpRight } from "lucide-react";
import { exhibitionsApi } from "@/api";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components";

import title from "@/assets/logos/title.png"
import topDecor from "@/assets/images/top-decor.png";
import anton from "@/assets/images/anton.png";
import dede from "@/assets/images/dede.png";
import eva from "@/assets/images/eva.png";


const Explore: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentSlide, setCurrentSlide] = useState(0);
    const autoScrollRef = useRef<number | null>(null);

    // Fetch exhibitions data
    const { data: exhibitionsData, isLoading, error, refetch } = useQuery({
        queryKey: ['exhibitions'],
        queryFn: () => exhibitionsApi.getAll({ cursor: null, limit: '8' }),
        retry: 3,
        staleTime: 5 * 60 * 1000,
    });

    const exhibitions = Array.isArray(exhibitionsData?.data) ? exhibitionsData.data : [];
    const filteredExhibitions = exhibitions.length > 0 ? exhibitions.filter((exhibition) =>
        exhibition?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exhibition?.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    // Audio characters data
    const audioCharacters = [
        { name: "Anton", avatar: anton, color: "bg-[#FFD942]" },
        { name: "Dede", avatar: dede, color: "bg-[#78C49E]" },
        { name: "Eva", avatar: eva, color: "bg-[#FFEBB2]" }
    ] as const;

    // Auto-scroll functionality
    useEffect(() => {
        if (filteredExhibitions.length <= 1) return;

        autoScrollRef.current = window.setTimeout(() => {
            setCurrentSlide((prev) => {
                const nextSlide = prev + 1;
                // Loop back to first slide when reaching the end
                return nextSlide >= filteredExhibitions.length ? 0 : nextSlide;
            });
        }, 10000); // 10 seconds

        return () => {
            if (autoScrollRef.current) {
                clearTimeout(autoScrollRef.current);
            }
        };
    }, [currentSlide, filteredExhibitions.length]);


    const handleDragEnd = (_event: unknown, info: PanInfo) => {
        const velocity = Math.abs(info.velocity.x);
        const offset = Math.abs(info.offset.x);
        
        // Calculate how many slides to skip based on swipe distance and velocity
        let slidesToMove = 1;
        
        if (offset > 150 || velocity > 500) {
            slidesToMove = Math.ceil(offset / 150) + Math.floor(velocity / 1000);
            slidesToMove = Math.min(slidesToMove, 3); // Max 3 slides per swipe
        }
        
        if (info.offset.x > 50) {
            // Swipe right (previous)
            setCurrentSlide((prev) => {
                const newSlide = prev - slidesToMove;
                return newSlide < 0 ? filteredExhibitions.length + newSlide : newSlide;
            });
        } else if (info.offset.x < -50) {
            // Swipe left (next)
            setCurrentSlide((prev) => (prev + slidesToMove) % filteredExhibitions.length);
        }
    };

    const SkeletonCard = () => (
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
    );

    if (error) {
        // Determine error type based on error message
        let errorType: "network" | "server" | "generic" = "generic";
        if (error.message.toLowerCase().includes('network') || error.message.toLowerCase().includes('fetch')) {
            errorType = "network";
        } else if (error.message.toLowerCase().includes('server') || error.message.toLowerCase().includes('500')) {
            errorType = "server";
        }

        return (
            <ErrorState
                type={errorType}
                title="Gagal Memuat Pameran"
                message="Tidak dapat memuat daftar pameran saat ini. Silakan coba lagi dalam beberapa saat."
                onRetry={() => refetch()}
                fullPage={true}
            />
        );
    }

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
                    <div className="w-full max-w-md relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 z-10" />
                        <Input
                            type="text"
                            placeholder="Eksplorasi pameran atau museum"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-white backdrop-blur-sm border-0 rounded-full font-sf font-light text-gray-800 placeholder-gray-500"
                        />
                    </div>
                </div>

                {/* Indonesian Heritage Section */}
                <div className="mb-8">
                    <h2 className="text-xl mb-4 text-yellow1 font-sf font-semibold">Jelajahi Pusaka Indonesia</h2>
                    
                    {/* Desktop Grid View */}
                    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {isLoading ? (
                            // Desktop Skeleton Loading
                            Array.from({ length: 8 }).map((_, index) => (
                                <div key={index} className="flex justify-center">
                                    <SkeletonCard />
                                </div>
                            ))
                        ) : filteredExhibitions.length > 0 ? filteredExhibitions.map((exhibition, index) => (
                            <motion.div
                                key={exhibition.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="bg-white/10 backdrop-blur-sm border-0 overflow-hidden hover:bg-white/20 transition-all duration-300 cursor-pointer">
                                    <CardContent className="p-0">
                                        <div className="aspect-[4/3] bg-gray-300 relative">
                                            {/* Image */}
                                            <img 
                                                src={exhibition.image_url || "https://placehold.co/207x256"} 
                                                alt={exhibition.name}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />

                                            {/* Greadient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                            
                                            {/* Text Content */}
                                            <div className="absolute bottom-5 left-5 right-5 z-20">
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
                                            <SkeletonCard />
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
                        ) : filteredExhibitions.length > 0 ? (
                            <div className="overflow-hidden">
                                <motion.div
                                    className="flex gap-4 cursor-grab active:cursor-grabbing"
                                    drag="x"
                                    dragConstraints={{
                                        left: -(filteredExhibitions.length - 1) * 215 - (filteredExhibitions.length > 1 ? 16 : 0),
                                        right: 0
                                    }}
                                    dragElastic={0.2}
                                    onDragEnd={handleDragEnd}
                                    animate={{ 
                                        x: currentSlide === filteredExhibitions.length - 1 
                                            ? -(currentSlide * 215 - (window.innerWidth - 207 - 32)) // Align last card to right
                                            : -currentSlide * 215
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                    {filteredExhibitions.map((exhibition, index) => (
                                        <motion.div
                                            key={exhibition.id}
                                            className="min-w-[207px] flex-shrink-0"
                                        >
                                            <Card className="bg-white/10 rounded-3xl backdrop-blur-sm border-0 overflow-hidden">
                                                <CardContent className="p-0 rounded-3xl">
                                                    <div className="w-[207px] h-[256px] bg-gray-200 relative group">
                                                        {/* Image */}
                                                        <img 
                                                            src={exhibition.image_url || "https://placehold.co/207x256"} 
                                                            alt={exhibition.name}
                                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />

                                                        {/* Greadient overlay */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                                        {/* Yellow ring for active card */}
                                                        {index === currentSlide && (
                                                            <div className="absolute inset-0 border-4 border-yellow-400 rounded-3xl z-10 pointer-events-none" />
                                                        )}

                                                        {/* Text Content */}
                                                        <div className="absolute bottom-5 left-5 right-5 z-20">
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
                                    ))}
                                </motion.div>
                                
                                {/* Dot indicators */}
                                <div className="flex justify-center mt-4 gap-2">
                                    {filteredExhibitions.map((_, index) => (
                                        <button
                                            key={index}
                                            className={`w-2 h-2 rounded-full transition-all ${
                                                index === currentSlide ? 'bg-yellow-400' : 'bg-white/30'
                                            }`}
                                            onClick={() => setCurrentSlide(index)}
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