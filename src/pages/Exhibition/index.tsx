import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { exhibitionsApi } from "@/api";
import { Button } from "@/components/ui/button";
import { ErrorState, ArtsyImagePlaceholder } from "@/components";
import { Collection } from "@/types";

const ExhibitionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Fetch exhibition details
  const { data: exhibition, isLoading: exhibitionLoading, error: exhibitionError } = useQuery({
    queryKey: ['exhibition', id],
    queryFn: () => exhibitionsApi.getById(id!),
    enabled: !!id,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch collections for this exhibition
  const { data: collectionsData, isLoading: collectionsLoading, error: collectionsError } = useQuery({
    queryKey: ['exhibition-collections', id],
    queryFn: () => exhibitionsApi.getCollections(id!, { cursor: null, limit: '20' }),
    enabled: !!id,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });

  const collections = collectionsData?.data || [];

  if (exhibitionError || collectionsError) {
    const error = exhibitionError || collectionsError;
    let errorType: "network" | "server" | "generic" = "generic";
    if (error?.message.toLowerCase().includes('network') || error?.message.toLowerCase().includes('fetch')) {
      errorType = "network";
    } else if (error?.message.toLowerCase().includes('server') || error?.message.toLowerCase().includes('500')) {
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
    <main className="flex flex-col w-full min-h-screen bg-white">
      {/* Header Section with Exhibition Image Background */}
      <div className="relative min-h-[50vh] flex flex-col overflow-hidden">
        {/* Background Image */}
        {exhibition?.image_url && (
          <div className="absolute inset-0">
            <img
              src={exhibition.image_url}
              alt={exhibition.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-blue1/50 backdrop-blur-[1px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue1 to-transparent" />
          </div>
        )}

        {/* Fallback Blue Gradient Background */}
        {!exhibition?.image_url && (
          <div className="absolute inset-0 bg-gradient-to-b from-blue1 via-blue1 to-blue2" />
        )}

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-20">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10 p-2 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>

        {/* Hero Content */}
        <div className="flex flex-col justify-end items-start px-4 pb-0 md:pb-20 pt-32 relative text-white">
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
                className="text-white text-lg mb-2 font-sf font-semibold"
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

        {/* Simple Wave Separator */}
        <div className="absolute -bottom-1 left-0 w-full overflow-hidden">
          <svg
            className="relative block w-full h-12"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60C200,20 400,100 600,60C800,20 1000,100 1200,60L1200,120L0,120Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Collections Section */}
      <div className="flex-1 bg-white px-4 py-8">
        <motion.h2
          className="text-2xl font-sf font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          Koleksi
        </motion.h2>

        {collectionsLoading ? (
          // Collections Skeleton
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="bg-gray-200 rounded-lg animate-pulse break-inside-avoid mb-4"
                style={{
                  height: `${200 + Math.random() * 100}px`
                }}
              />
            ))}
          </div>
        ) : collections.length > 0 ? (
          <motion.div
            className="columns-2 md:columns-3 gap-4 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {collections.map((collection: Collection, index: number) => (
              <motion.div
                key={collection.id}
                className="relative rounded-lg overflow-hidden shadow-md cursor-pointer group break-inside-avoid mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArtsyImagePlaceholder
                  src={collection.picture_url}
                  alt={collection.name}
                  name={collection.name}
                  imageClassName="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  className="relative"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-sf font-semibold text-sm line-clamp-2">
                    {collection.name}
                  </h3>
                  {collection.artist_name && (
                    <p className="text-white/80 text-xs font-inter mt-1">
                      {collection.artist_name}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="text-gray-400 mb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏛️</span>
              </div>
              <h3 className="text-lg font-sf font-semibold mb-2 text-gray-600">
                Tidak Ada Koleksi
              </h3>
              <p className="text-gray-500">
                Koleksi untuk pameran ini belum tersedia
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default ExhibitionDetail;