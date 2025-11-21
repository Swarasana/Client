import React, { useState, useEffect, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Filter, ChevronLeft, Loader2 } from "lucide-react";
import { exhibitionsApi } from "@/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExhibitionCard } from "@/components";
import { Exhibition } from "@/types";

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      if (searchQuery) {
        setSearchParams({ q: searchQuery });
      } else {
        setSearchParams({});
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, setSearchParams]);

  // Infinite query for exhibitions
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['exhibitions-search', debouncedQuery],
    queryFn: ({ pageParam }: { pageParam: string | null }) => exhibitionsApi.getAll({
      cursor: pageParam,
      limit: '12',
    }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination?.hasMore ? lastPage.pagination?.nextCursor : null;
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });

  const exhibitions = data?.pages?.flatMap(page => page.data) || [];

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(searchQuery);
    if (searchQuery) {
      setSearchParams({ q: searchQuery });
    }
  };

  const filteredExhibitions = exhibitions.filter((exhibition: Exhibition) => {
    if (!debouncedQuery) return true;
    return exhibition?.name?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
           exhibition?.description?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
           exhibition?.location?.toLowerCase().includes(debouncedQuery.toLowerCase());
  });

  return (
    <main className="flex flex-col w-full min-h-screen bg-blue1 text-white">
      <div className="relative z-10 p-4 pb-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10 p-2"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-sf font-semibold">Pencarian Pameran</h1>
        </div>

        {/* Search Bar with Filter */}
        <div className="flex gap-3 mb-6">
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 z-10" />
              <Input
                type="text"
                placeholder="Cari pameran, museum, atau lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white backdrop-blur-sm border-0 rounded-full font-sf font-light text-gray-800 placeholder-gray-500"
              />
            </div>
          </form>
          <Button
            variant="ghost"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="bg-white hover:bg-gray-100 text-gray-800 h-[2.25rem] w-10 rounded-3xl p-0 flex items-center justify-center"
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Search Results Count */}
        {debouncedQuery && (
          <div className="mb-4">
            <p className="text-white/80 text-sm">
              {isLoading ? 'Mencari...' : `Ditemukan ${filteredExhibitions.length} hasil untuk "${debouncedQuery}"`}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <>
            {/* Mobile Loading */}
            <div className="md:hidden grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={`mobile-skeleton-${index}`} className="flex justify-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl w-[160px] h-[209px] animate-pulse" />
                </div>
              ))}
            </div>
            
            {/* Desktop Loading */}
            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={`desktop-skeleton-${index}`} className="bg-white/10 backdrop-blur-sm rounded-lg aspect-[4/3] animate-pulse" />
              ))}
            </div>
          </>
        )}

        {/* Search Results */}
        {!isLoading && (
          <>
            {filteredExhibitions.length > 0 ? (
              <>
                {/* Mobile Grid */}
                <div className="md:hidden grid grid-cols-2 gap-4">
                  {filteredExhibitions.map((exhibition: Exhibition, index: number) => (
                    <div key={`mobile-${exhibition.id}-${index}`} className="flex justify-center">
                      <ExhibitionCard
                        exhibition={exhibition}
                        index={index}
                        variant="mobile"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Desktop Grid */}
                <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredExhibitions.map((exhibition: Exhibition, index: number) => (
                    <ExhibitionCard
                      key={`desktop-${exhibition.id}-${index}`}
                      exhibition={exhibition}
                      index={index}
                      variant="desktop"
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-white/60 mb-4">
                  <Search className="w-16 h-16 mx-auto mb-4 text-white/40" />
                  <h3 className="text-lg font-sf font-semibold mb-2">
                    {debouncedQuery ? 'Tidak Ada Hasil' : 'Mulai Pencarian'}
                  </h3>
                  <p className="text-white/80">
                    {debouncedQuery 
                      ? `Tidak ditemukan pameran untuk "${debouncedQuery}"`
                      : 'Masukkan kata kunci untuk mencari pameran'
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Loading More Indicator */}
            {isFetchingNextPage && (
              <div className="flex justify-center py-8">
                <div className="flex items-center gap-2 text-white/80">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Memuat lebih banyak...</span>
                </div>
              </div>
            )}

            {/* No More Results */}
            {!hasNextPage && filteredExhibitions.length > 0 && !isFetchingNextPage && (
              <div className="text-center py-8">
                <p className="text-white/60 text-sm">
                  Tidak ada hasil lagi
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default SearchPage;