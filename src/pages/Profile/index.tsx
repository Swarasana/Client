import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronLeft } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import headerPattern from "@/assets/images/header-pattern-big.svg";
import visitor from "@/assets/images/visitor.png";
import curator from "@/assets/images/anton.png";
import trophy from "@/assets/images/trophy.svg";
import trophyYellow from "@/assets/images/trophy-yellow.svg";
import CommentCard from "@/components/CommentCard";
import { levelsApi, merchApi, userApi } from "@/api";
import { Level, Merch, Profile as ProfileType } from "@/types";
import MerchCard from "@/components/MerchCard";

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

    const levelsRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    useEffect(() => {
        load();
    }, []);

    async function load() {
        const p = await userApi.getProfile();
        setProfile(p.user);
        console.log(p.user);

        const levelsList = await levelsApi.getLevels();
        setLevels(levelsList);
        console.log(levelsList);

        const merchList = await merchApi.getMerch();
        setMerch(merchList);
        console.log(merchList);
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

    if (!profile) {
        return (
            <main className="flex items-center justify-center h-screen text-white">
                Loading...
            </main>
        );
    }

    return (
        <main className="flex flex-col w-full h-screen bg-gradient-to-t from-blue1 via-blue1 to-blue2 text-white overflow-hidden">
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-0">
                <img
                    src={headerPattern}
                    alt="Motif latar belakang"
                    className="w-full"
                />
            </div>

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
                                    <img
                                        src={curator}
                                        alt=""
                                        className="w-14 h-14"
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

            <div className="flex flex-col top-0 w-full max-w-screen px-6 gap-0 items-start z-10 font-sf">
                <div className="flex justify-between items-center py-4 flex-shrink-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="text-white hover:bg-white/10 p-2 rounded-full"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                </div>

                <div className="flex flex-row gap-4 w-full mb-12 text-white">
                    <div className="w-24 h-24 rounded-full bg-[#78C49E] flex-shrink-0">
                        <img
                            src={profile.user_pic_url ?? visitor}
                            alt="Foto profil"
                            className="w-full"
                        />
                    </div>
                    <div className="flex flex-col gap-0 grow max-w-full min-w-0 justify-center">
                        <p className="font-bold text-3xl max-w-full truncate overflow-hidden text-ellipsis whitespace-nowrap">
                            Halo, {profile.display_name}
                        </p>
                        <p className="text-base pb-1">
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

                <div className="flex flex-col gap-2 my-6">
                    <p className="font-bold text-lg">
                        Koleksi yang Pernah Kamu Lihat
                    </p>
                    {/* <CollectionCard collection={} /> */}
                </div>

                {profile.role == "visitor" && (
                    <div className="flex flex-col gap-4 my-6">
                        <p className="font-bold text-lg">Kontribusi Kamu</p>
                        <div className="flex gap-4 overflow-x-auto flex-nowrap">
                            {profile.comments.map((c) => (
                                <CommentCard key={c.id} comment={c} />
                            ))}
                        </div>
                    </div>
                )}

                {profile.role == "visitor" && (
                    <div className="flex flex-col gap-2">
                        <p className="font-bold text-lg">
                            Dapatkan Merchandise
                        </p>
                        <div className="flex flex-col gap-4">
                            {merch.map((m) => (
                                <MerchCard key={m.id} merch={m} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Profile;
