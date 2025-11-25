import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
    ChevronLeft,
    Eye,
    Heart,
    MessageSquare,
    Pen,
    QrCode,
} from "lucide-react";
import { exhibitionsApi } from "@/api";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components";
import { Collection } from "@/types";
import headerPattern from "@/assets/images/header-pattern-gradient.svg";
import { Card, CardContent } from "@/components/ui/card";

const ProfileExhibitionDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const handleCollectionClick = (collectionId: string) => {
        navigate(`/collection/${collectionId}`);
    };

    // Fetch exhibition details
    const {
        data: exhibition,
        isLoading: exhibitionLoading,
        error: exhibitionError,
    } = useQuery({
        queryKey: ["exhibition", id],
        queryFn: () => exhibitionsApi.getById(id!),
        enabled: !!id,
        retry: 3,
        staleTime: 5 * 60 * 1000,
    });

    // Fetch collections for this exhibition
    const {
        data: collectionsData,
        isLoading: collectionsLoading,
        error: collectionsError,
    } = useQuery({
        queryKey: ["exhibition-collections", id],
        queryFn: () =>
            exhibitionsApi.getCollections(id!, { cursor: null, limit: "20" }),
        enabled: !!id,
        retry: 3,
        staleTime: 5 * 60 * 1000,
    });

    const collections = collectionsData?.data || [];

    if (exhibitionError || collectionsError) {
        const error = exhibitionError || collectionsError;
        let errorType: "network" | "server" | "generic" = "generic";
        if (
            error?.message.toLowerCase().includes("network") ||
            error?.message.toLowerCase().includes("fetch")
        ) {
            errorType = "network";
        } else if (
            error?.message.toLowerCase().includes("server") ||
            error?.message.toLowerCase().includes("500")
        ) {
            errorType = "server";
        }

        return (
            <ErrorState
                type={errorType}
                title="Gagal Memuat Detail Pameran"
                message="Tidak dapat memuat detail pameran saat ini. Silakan coba lagi dalam beberapa saat."
                onRetry={() => window.location.reload()}
                fullPage={true}
            />
        );
    }

    return (
        <main
            className={`flex flex-col w-full max-w-screen h-full min-h-screen bg-gradient-to-t from-[#428DBC] via-[#3A79C4] to-[#3A79C4] text-white overflow-y-auto`}
        >
            {/* Header Section with Exhibition Image Background */}
            <div className="relative flex flex-col overflow-hidden">
                {/* Background Image */}
                <motion.div
                    className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.7 }}
                >
                    <img
                        src={headerPattern}
                        alt="Motif latar belakang"
                        className="w-full"
                    />
                </motion.div>

                {/* Back & Edit Button */}
                <div className="absolute top-4 px-4 z-20 flex flex-row w-screen">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="text-white hover:bg-white/10 p-2 rounded-full"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <div className="flex-grow"></div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/exhibition/add")}
                        className="text-white hover:bg-white/10 p-2 rounded-full"
                    >
                        <Pen className="w-6 h-6" />
                    </Button>
                </div>

                {/* Hero Content */}
                <div className="flex flex-col justify-start items-start px-4 pb-16 pt-20 min-h-[310px] relative text-white">
                    {exhibitionLoading ? (
                        <div className="w-full">
                            <div className="h-8 w-64 bg-white/20 rounded animate-pulse mb-2" />
                            <div className="h-4 w-32 bg-white/20 rounded animate-pulse mb-4" />
                            <div className="h-16 w-80 bg-white/20 rounded animate-pulse" />
                        </div>
                    ) : exhibition ? (
                        <motion.div
                            className="w-full max-w-4xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Title */}
                            <motion.h1
                                className="text-2xl md:text-4xl text-yellow1 font-sf font-bold mb-1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                {exhibition.name}
                            </motion.h1>

                            {/* Location */}
                            <motion.p
                                className="text-white text-lg mb-1 font-sf font-semibold"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                {exhibition.location}
                            </motion.p>

                            {/* Description */}
                            <motion.p
                                className="text-white/90 leading-relaxed text-sm md:text-base font-inter max-w-2xl"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                            >
                                {exhibition.description}
                            </motion.p>
                        </motion.div>
                    ) : null}
                </div>
            </div>

            {/* Collections Section */}
            <div className="flex flex-col flex-1 gap-4 px-4 pt-4 pb-20">
                {collectionsLoading ? (
                    <div className="flex flex-col gap-4 w-full">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={`skeleton-${index}`}
                                className="h-[378px] bg-gray-200 rounded-3xl animate-pulse break-inside-avoid"
                            />
                        ))}
                    </div>
                ) : collections.length > 0 ? (
                    <>
                        <motion.h2
                            className="text-lg font-sf font-bold text-white"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                        >
                            Koleksi Favorit
                        </motion.h2>
                        <ProfileCollection
                            key={-1}
                            collection={collections[0]}
                            index={0}
                            handleCollectionClick={handleCollectionClick}
                        />
                    </>
                ) : (
                    <></>
                )}

                <motion.h2
                    className="text-lg font-sf font-bold text-white mt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                >
                    Semua Koleksi
                </motion.h2>

                {collectionsLoading ? (
                    // Collections Skeleton
                    <div className="flex flex-col gap-4 w-full">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={`skeleton-${index}`}
                                className="h-[378px] bg-gray-200 rounded-3xl animate-pulse break-inside-avoid"
                            />
                        ))}
                    </div>
                ) : collections.length > 0 ? (
                    <motion.div
                        className="flex flex-col gap-4 w-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        {collections.map(
                            (collection: Collection, index: number) => (
                                <ProfileCollection
                                    key={index}
                                    collection={collection}
                                    index={index}
                                    handleCollectionClick={
                                        handleCollectionClick
                                    }
                                />
                            )
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        className="text-center py-6 bg-white/20 border border-white rounded-3xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        <div className="text-gray-400 mb-2">
                            <div className="w-12 h-12 mx-auto mb-2 bg-gray-50/50 rounded-full flex items-center justify-center">
                                <span className="text-2xl">🏛️</span>
                            </div>
                            <h3 className="mb-1 text-base font-sf font-semibold text-white">
                                Tidak Ada Koleksi
                            </h3>
                            <p className="text-white/70 text-xs">
                                Kamu belum menambahkan koleksi
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </main>
    );
};

const ProfileCollection: React.FC<{
    collection: Collection;
    index: number;
    handleCollectionClick: (id: string) => void;
}> = ({ collection, index, handleCollectionClick }) => {
    const downloadQR = async (url: string, filename = "qr-code.png") => {
        const response = await fetch(url);
        const blob = await response.blob();

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <motion.div
            key={collection.id}
            className="flex w-full snap-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: 0.9 + index * 0.1,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCollectionClick(collection.id)}
        >
            <Card
                className="bg-white w-full rounded-3xl transition-all duration-300 font-sf text-black"
                onClick={() => {
                    handleCollectionClick(collection.id);
                }}
            >
                <CardContent className="p-4 flex flex-row w-full gap-3">
                    <img
                        src={collection.picture_url}
                        alt="Gambar Koleksi"
                        className="w-28 h-28 object-cover rounded-2xl"
                    />
                    <div className="flex flex-col flex-grow gap-1">
                        <div className="flex flex-row w-full gap-2 items-start">
                            <p className="flex-grow pt-1 font-bold text-xl text-wrap leading-tight">
                                {collection.name}
                            </p>
                            <Button
                                className="p-0 w-8 h-8 rounded-full bg-transparent text-black shadow-none"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    downloadQR(
                                        collection.qr_code_url,
                                        `qr-${
                                            collection.name || "collection"
                                        }.png`
                                    );
                                }}
                            >
                                <QrCode className="text-[24px] w-full h-full flex-shrink-0" />
                            </Button>
                        </div>
                        <p className="flex-grow font-normal text-base">
                            {collection.artist_name}
                        </p>
                        <div className="flex flex-row gap-2 items-center">
                            <div className="flex-grow"></div>
                            <MessageSquare
                                className="w-5 h-5"
                                color="#696969"
                            />
                            <p>0</p>
                            <Heart className="w-5 h-5 ml-2" color="#696969" />
                            <p>{collection.likes_count}</p>
                            <Eye className="w-5 h-5 ml-1" color="#696969" />
                            <p>{collection.visitor_count}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ProfileExhibitionDetail;
