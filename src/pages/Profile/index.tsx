import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronLeft, Trophy } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import headerPattern from "@/assets/images/header-pattern-big.svg";
import visitor from "@/assets/images/visitor.png";
import curator from "@/assets/images/anton.png";
import trophy from "@/assets/images/trophy.svg";
import CommentsContent from "../Collection/CommentsContent";
import CollectionCard from "@/components/CollectionCard";
import CommentCard from "@/components/CommentCard";
import { commentsApi, merchApi, userApi } from "@/api";
import { Merch, Profile as ProfileType } from "@/types";
import MerchCard from "@/components/MerchCard";

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [merch, setMerch] = useState<Merch[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        load();
    }, []);

    async function load() {
        const p = await userApi.getProfile();
        setProfile(p.user);
        console.log(p.user);

        const merchList = await merchApi.getMerch();
        setMerch(merchList);
        console.log(merchList);
    }

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
                            <div className="flex flex-row items-center justify-center gap-2 w-full bg-yellow-400 py-1 pl-3.5 pr-2 rounded-3xl text-black text-sm leading-none">
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
                                <MerchCard merch={m} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Profile;
