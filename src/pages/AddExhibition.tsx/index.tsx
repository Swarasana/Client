import { Button } from "@/components/ui/button";
import { Check, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { exhibitionsApi } from "@/api";
import { useUser } from "@/hooks/useUser";

const AddExhibition: React.FC = () => {
    const [exhibitionName, setExhibitionName] = useState("");
    const [exhibitionLocation, setExhibitionLocation] = useState("");
    const [exhibitionDesc, setExhibitionDesc] = useState("");
    const [exhibitionImage, setExhibitionImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [exhibitionSubmitted, setExhibitionSubmitted] = useState(false);

    const navigate = useNavigate();

    const { user } = useUser();

    const handleSubmitExhibition = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!user) return;

        try {
            const payload = {
                name: exhibitionName,
                location: exhibitionLocation,
                description: exhibitionDesc,
                image_url: exhibitionImage,
                curator_id: user.id,
                curator_name: user.display_name,
            };

            await exhibitionsApi.addExhibition(payload);

            setExhibitionSubmitted(true);
            setTimeout(() => navigate(-1), 1500); // auto go back
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col w-full h-screen bg-gradient-to-t from-blue1 via-blue1 to-[#1371AB] text-white overflow-hidden">
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
            <div className="flex flex-col top-0 w-full max-w-screen px-6 py-24 gap-8 items-start z-10 font-sf">
                <p className="font-bold text-2xl">Pendaftaran Pameran</p>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-sm bg-white shadow-xl rounded-3xl p-7"
                >
                    <form
                        onSubmit={handleSubmitExhibition}
                        className="flex flex-col items-center gap-4 text-black text-sm"
                    >
                        <div className="w-full flex flex-col gap-2">
                            <label className="w-full text-start font-medium">
                                Nama Pameran
                            </label>
                            <Input
                                type="text"
                                value={exhibitionName}
                                onChange={(e) =>
                                    setExhibitionName(e.target.value)
                                }
                                className="w-full py-6 pl-4 pr-2 border-none rounded bg-gray-100 font-sf"
                                required
                            />
                        </div>

                        <div className="w-full flex flex-col gap-2">
                            <label className="w-full text-start font-medium">
                                Lokasi
                            </label>
                            <Input
                                type="text"
                                value={exhibitionLocation}
                                onChange={(e) =>
                                    setExhibitionLocation(e.target.value)
                                }
                                className="w-full py-6 pl-4 pr-2 border-none rounded bg-gray-100 font-sf"
                                required
                            />
                        </div>

                        <div className="w-full flex flex-col gap-2">
                            <label className="w-full text-start font-medium">
                                Deskripsi Pameran
                            </label>
                            <textarea
                                value={exhibitionDesc}
                                onChange={(e) =>
                                    setExhibitionDesc(
                                        e.target.value.slice(0, 500)
                                    )
                                }
                                className="w-full h-32 p-4 rounded bg-gray-100 font-sf text-start resize-y overflow-auto"
                                placeholder="Tulis deskripsi pameran..."
                                required
                            />
                            <p className="text-xs text-gray-500">
                                {exhibitionDesc.length}/500 characters
                            </p>
                        </div>

                        <div className="w-full flex flex-col gap-2">
                            <label className="w-full text-start font-medium">
                                Gambar Pameran (URL)
                            </label>
                            <Input
                                type="text"
                                value={exhibitionImage}
                                onChange={(e) =>
                                    setExhibitionImage(e.target.value)
                                }
                                className="w-full py-6 pl-4 pr-2 border-none rounded bg-gray-100 font-sf"
                                placeholder="Masukkan URL gambar"
                            />
                        </div>

                        {error && (
                            <p className="w-full font-sf text-red-500 text-sm text-start pb-2 pl-2">
                                {error}
                            </p>
                        )}

                        <div className="flex flex-row w-full">
                            {exhibitionSubmitted ? (
                                <div className="flex flex-row flex-grow gap-1 items-center font-medium text-blue2 text-sm">
                                    <Check className="w-4 h-4" />
                                    <p>Data berhasil disimpan</p>
                                </div>
                            ) : (
                                <div className="flex flex-row flex-grow"></div>
                            )}
                            <Button
                                type="submit"
                                className="bg-yellow-400 hover:bg-yellow-500 font-sf font-medium text-gray-900 text-sm rounded-full py-3 px-8"
                                disabled={loading}
                            >
                                {loading ? "Loading..." : "Daftar"}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </main>
    );
};

export default AddExhibition;
