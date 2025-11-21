import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronLeft, Trophy } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import headerPattern from "@/assets/images/header-pattern-big.svg";
import visitor from "@/assets/images/visitor.png";
import curator from "@/assets/images/anton.png";
import trophy from "@/assets/images/trophy.svg";
import CommentsContent from "../Collection/CommentsContent";

const Profile: React.FC = () => {
    const navigate = useNavigate();

    return (
        <main className="flex flex-col w-full h-screen bg-gradient-to-t from-blue1 via-blue1 to-blue2 text-white overflow-hidden">
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-0">
                <img
                    src={headerPattern}
                    alt="Motif latar belakang"
                    className="w-full"
                />
            </div>

            <div className="flex flex-col top-0 px-6 gap-0 items-start z-10 font-sf">
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

                <div className="flex flex-row gap-4 w-full mb-16 text-white">
                    <div className="w-24 h-24 rounded-full bg-[#78C49E]">
                        <img
                            src={visitor}
                            alt="Foto profil"
                            className="w-full"
                        />
                    </div>
                    <div className="flex flex-col gap-0 grow">
                        <p className="font-bold text-3xl">Halo, Nama</p>
                        <p className="text-base pb-1">Pengunjung</p>
                        <div className="flex flex-row items-center justify-center gap-2 w-full bg-yellow-400 py-1 rounded-3xl text-black text-sm">
                            <img src={trophy} alt="Ikon Poin" />
                            <p className="font-bold">150</p>
                            <div className="w-1 h-1 bg-[#BD9700]"></div>
                            <p className="font-medium">"Si Paling Museum"</p>
                            <ChevronDown />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="font-bold text-lg">
                        Pameran yang Pernah Kamu Kunjungi
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="font-bold text-lg">Kontribusi Kamu</p>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="font-bold text-lg">Dapatkan Merchandise</p>
                </div>
            </div>
        </main>
    );
};

export default Profile;
