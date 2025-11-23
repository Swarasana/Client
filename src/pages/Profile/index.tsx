import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import headerPatternVisitor from "@/assets/images/header-pattern-big.svg";
import headerPatternCurator from "@/assets/images/header-pattern-big-yellow.svg";
import visitor from "@/assets/images/visitor.png";
import trophy from "@/assets/images/trophy.svg";
import trophyYellow from "@/assets/images/trophy-yellow.svg";
import CommentCard from "@/components/CommentCard";
import { exhibitionsApi, levelsApi, merchApi, userApi } from "@/api";
import { Exhibition, Level, Merch, Profile as ProfileType } from "@/types";
import MerchCard from "@/components/MerchCard";
import { ExhibitionCard } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [merch, setMerch] = useState<Merch[]>([]);
    const [levels, setLevels] = useState<Level[]>([]);

    const [showLevelsOverlay, setShowLevelsOverlay] = useState(false);
    const [levelsOverlayPos, setLevelsOverlayPos] = useState<{
        top: number;
        right: number;
    }>({
        top: 0,
        right: 0,
    });
    const [levelsAvatarLoaded, setLevelsAvatarLoaded] = useState(false);

    const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
    const [exhibitionsCursor, setExhibitionsCursor] = useState<string | null>(
        null
    );
    const [hasMoreExhibitions, setHasMoreExhibitions] = useState(true);
    const [loadingExhibitions, setLoadingExhibitions] = useState(false);

    const levelsRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        if (profile?.id && profile?.role == "curator") loadMoreExhibitions();
    }, [profile]);

    async function load() {
        const p = await userApi.getProfile();
        setProfile(p.user);
        console.log(p.user);

        if (p.user.role == "visitor") {
            const levelsList = await levelsApi.getLevels();
            setLevels(levelsList);
            console.log(levelsList);

            const merchList = await merchApi.getMerch();
            setMerch(merchList);
            console.log(merchList);
        }
    }

    async function loadMoreExhibitions() {
        if (loadingExhibitions || !hasMoreExhibitions) return;

        setLoadingExhibitions(true);

        const res = await exhibitionsApi.getAll({
            curatorId: profile!.id,
            limit: "2",
            cursor: exhibitionsCursor ?? null,
        });

        const { data, pagination } = res;

        setExhibitions((prev) => [...prev, ...data]);

        setExhibitionsCursor(pagination.nextCursor);
        setHasMoreExhibitions(pagination.hasMore);

        setLoadingExhibitions(false);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                levelsRef.current &&
                !levelsRef.current.contains(event.target as Node)
            ) {
                setShowLevelsOverlay(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLevelsClick = () => {
        console.log("clicked");
        if (levelsRef.current) {
            const rect = levelsRef.current.getBoundingClientRect();
            setLevelsOverlayPos({
                top: rect.bottom + window.scrollY,
                right: window.innerWidth - rect.right - window.scrollX,
            });
            setShowLevelsOverlay(!showLevelsOverlay);
        }
    };

    const handleAddExhibitionClick = () => {
        navigate("/exhibition/add");
    };

    if (!profile) {
        return (
            <main className="flex items-center justify-center h-screen text-white">
                Loading...
            </main>
        );
    }

    return (
        <main
            className={`flex flex-col w-full max-w-screen h-full min-h-screen bg-gradient-to-t ${
                profile.role == "curator"
                    ? "from-[#1371AB] via-blue1 to-blue1"
                    : "from-blue1 via-blue1 to-blue2"
            } text-white overflow-y-auto`}
        >
            <motion.div
                className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.7 }}
            >
                <img
                    src={
                        profile.role == "visitor"
                            ? headerPatternVisitor
                            : headerPatternCurator
                    }
                    alt="Motif latar belakang"
                    className="w-full"
                />
            </motion.div>

            <AnimatePresence>
                {showLevelsOverlay && (
                    <motion.div
                        className="absolute z-50 w-72 bg-white rounded-3xl shadow-lg p-4 font-sf text-black border-[6px] border-[#78C49E]"
                        style={{
                            top: levelsOverlayPos.top + 18,
                            right: levelsOverlayPos.right,
                        }}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <div className="absolute -top-5 right-20 w-0 h-0">
                            <div className="border-l-[18px] border-r-[18px] border-b-[18px] border-l-transparent border-r-transparent border-b-[#78C49E]"></div>
                            <div className="absolute top-[8px] left-[5px] border-l-[13px] border-r-[13px] border-b-[13px] border-l-transparent border-r-transparent border-b-white"></div>
                        </div>

                        <div className="flex flex-col gap-4">
                            {levels.map((level) => (
                                <div
                                    key={level.id}
                                    className="flex flex-row w-full gap-2 items-center"
                                >
                                    {!levelsAvatarLoaded && (
                                        <Skeleton className="w-14 h-14" />
                                    )}
                                    <img
                                        src={level.avatar_url}
                                        alt=""
                                        className="w-14 h-14"
                                        onLoad={() =>
                                            setLevelsAvatarLoaded(true)
                                        }
                                    />
                                    <div className="flex flex-col gap-0">
                                        <div className="flex flex-row">
                                            <p className="flex-grow font-semibold text-[#054FB9]/45 text-xs">
                                                Level {level.level_number}
                                            </p>
                                            <div className="flex flex-row items-center gap-1">
                                                <img
                                                    src={trophyYellow}
                                                    alt="Poin"
                                                    className="w-3 h-3"
                                                />
                                                <p className="font-bold text-xs text-yellow-400">
                                                    {level.minimum_points}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-blue1 text-sm">
                                            "{level.level_name}"
                                        </p>
                                        <p className="text-[10px]">
                                            {level.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="flex flex-col top-0 w-full max-w-screen py-12 gap-0 items-start z-10 font-sf"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                <div className="flex flex-row gap-4 px-4  w-full mb-12 text-white">
                    <div className="w-24 h-24 rounded-full bg-[#78C49E] flex-shrink-0">
                        <img
                            src={profile.user_pic_url ?? visitor}
                            alt="Foto profil"
                            className="w-full"
                        />
                    </div>
                    <div className="flex flex-col gap-0 grow max-w-full min-w-0 justify-center">
                        <p
                            className={`font-bold text-3xl max-w-full truncate overflow-hidden text-ellipsis whitespace-nowrap ${
                                profile.role == "visitor"
                                    ? "text-white"
                                    : "text-black"
                            }`}
                        >
                            Halo, {profile.display_name}
                        </p>
                        <p
                            className={`text-base pb-1 ${
                                profile.role == "visitor"
                                    ? "text-white"
                                    : "text-black"
                            }`}
                        >
                            {profile.role == "visitor"
                                ? "Pengunjung"
                                : "Kurator"}
                        </p>
                        {profile.role == "visitor" && (
                            <div
                                ref={levelsRef}
                                className="flex flex-row items-center justify-center gap-2 w-full bg-yellow-400 py-1 pl-3.5 pr-2 rounded-3xl text-black text-sm leading-none"
                                onClick={handleLevelsClick}
                            >
                                <img src={trophy} alt="Ikon Poin" />
                                <p className="font-bold">{profile.points}</p>
                                <div className="w-1 h-1 bg-[#BD9700] rounded-full"></div>
                                <p className="font-medium flex-grow text-center">
                                    "{profile.level.level_name}"
                                </p>
                                <ChevronDown />
                            </div>
                        )}
                    </div>
                </div>

                {profile.role == "visitor" && (
                    <div className="flex flex-col gap-8 mt-8 w-full">
                        <div className="flex flex-col gap-2 px-4">
                            <p className="font-bold text-lg">
                                Koleksi yang Pernah Kamu Lihat
                            </p>
                            {/* <CollectionCard collection={} /> */}
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
                                        Kamu belum pernah melihat koleksi
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <p className="mx-4 font-bold text-lg">
                                Kontribusi Kamu
                            </p>
                            {profile.comments.length > 0 ? (
                                <div className="flex gap-4 overflow-x-auto flex-nowrap">
                                    {profile.comments.map((c, i) => (
                                        <CommentCard
                                            key={c.id}
                                            comment={c}
                                            className={
                                                i === 0
                                                    ? "ml-4"
                                                    : i ===
                                                      profile.comments.length -
                                                          1
                                                    ? "mr-4"
                                                    : ""
                                            }
                                        />
                                    ))}
                                </div>
                            ) : (
                                <motion.div
                                    className="text-center py-6 bg-white/20 border border-white rounded-3xl mx-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                >
                                    <div className="text-gray-400 mb-2">
                                        <div className="w-12 h-12 mx-auto mb-2 bg-gray-50/50 rounded-full flex items-center justify-center">
                                            <span className="text-2xl">💬</span>
                                        </div>
                                        <h3 className="mb-1 text-base font-sf font-semibold text-white">
                                            Tidak Ada Komentar
                                        </h3>
                                        <p className="text-white/70 text-xs">
                                            Kamu belum pernah meninggalkan
                                            komentar
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 px-4">
                            <p className="font-bold text-lg">
                                Dapatkan Merchandise
                            </p>
                            <div className="flex flex-col gap-4">
                                {merch.map((m) => (
                                    <MerchCard key={m.id} merch={m} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {profile.role == "curator" && (
                    <div className="flex flex-col gap-8 w-full mt-8 mb-16 px-4">
                        <div className="flex flex-col gap-2 w-full">
                            <p className="font-bold text-lg">Pameranmu</p>
                            <div className="flex flex-col gap-4">
                                {exhibitions.length > 0 ? (
                                    <div className="space-y-4">
                                        {exhibitions.map((exhibition) => (
                                            <ExhibitionCard
                                                key={exhibition.id}
                                                exhibition={exhibition}
                                                orientation="horizontal"
                                                onClick={() => {
                                                    navigate(
                                                        `/profile/exhibition/${exhibition.id}`
                                                    );
                                                }}
                                            />
                                        ))}
                                        {hasMoreExhibitions && (
                                            <Button
                                                onClick={loadMoreExhibitions}
                                                disabled={loadingExhibitions}
                                                className="w-full text-white rounded-full disabled:bg-transparent hover:bg-transparent hover:text-yellow-300"
                                                variant="ghost"
                                            >
                                                {loadingExhibitions
                                                    ? "Loading..."
                                                    : "Muat lebih banyak"}
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <motion.div
                                        className="text-center py-6 bg-white/20 border border-white rounded-3xl"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.8,
                                        }}
                                    >
                                        <div className="text-gray-400 mb-2">
                                            <div className="w-12 h-12 mx-auto mb-2 bg-gray-50/50 rounded-full flex items-center justify-center">
                                                <span className="text-2xl">
                                                    🏛️
                                                </span>
                                            </div>
                                            <h3 className="mb-1 text-base font-sf font-semibold text-white">
                                                Tidak Ada Pameran
                                            </h3>
                                            <p className="text-white/70 text-xs">
                                                Kamu belum pernah mendaftarkan
                                                pameran
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        <Button
                            className="flex flex-row gap-1 items-center w-fit rounded-full bg-yellow-400 hover:bg-yellow-500 font-sf font-medium text-black text-base"
                            onClick={handleAddExhibitionClick}
                        >
                            <Plus className="w-4 h-4" />
                            Daftarkan Pameran
                        </Button>
                    </div>
                )}
            </motion.div>
        </main>
    );
};

export default Profile;
