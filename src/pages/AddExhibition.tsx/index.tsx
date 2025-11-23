import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, Plus, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { collectionsApi, exhibitionsApi } from "@/api";
import { useUser } from "@/hooks/useUser";
import { Collection } from "@/types";
import { supabase } from "@/lib/supabase";
import compressImage from "@/utils/imageCompressor";

const AddExhibition: React.FC = () => {
    const [exhibitionId, setExhibitionId] = useState<string | null>(null);
    const [exhibitionName, setExhibitionName] = useState("");
    const [exhibitionLocation, setExhibitionLocation] = useState("");
    const [exhibitionDesc, setExhibitionDesc] = useState("");
    const [exhibitionImageUrl, setExhibitionImageUrl] = useState("");

    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(
        null
    );
    const [uploadedFileName, setUploadedFileName] = useState("");
    const [imageUploading, setImageUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [hasSubmittedExhibitionOnce, setHasSubmittedExhibitionOnce] =
        useState(false);
    const [exhibitionSubmitted, setExhibitionSubmitted] = useState(false);
    const [_isEditingExhibition, setIsEditingExhibition] = useState(false);

    const [collections, setCollections] = useState<
        {
            name: string;
            artist_name: string;
            description: string;
            image_url: string;
            image_file: File | null;
            uploading: boolean;
            uploadedName: string;
            loading: boolean;
            error: string;
            submittedOnce: boolean;
            submitted: boolean;
            qr_code_url: string;
        }[]
    >([]);

    const navigate = useNavigate();

    const { user } = useUser();

    const handleSubmitExhibition = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!user) return;

        try {
            let imageUrl = exhibitionImageUrl;

            if (selectedImageFile) {
                setImageUploading(true);

                const compressed = await compressImage(selectedImageFile, 0.7);

                const fileName = `${Date.now()}_${selectedImageFile.name}`;

                const { error } = await supabase.storage
                    .from("exhibitions")
                    .upload(fileName, compressed);

                if (error) throw error;

                imageUrl = supabase.storage
                    .from("exhibitions")
                    .getPublicUrl(fileName).data.publicUrl;

                setExhibitionImageUrl(imageUrl);
                setImageUploading(false);
            } else {
                return alert("Unggah gambar pameran terlebih dahulu");
            }

            const payload = {
                name: exhibitionName,
                location: exhibitionLocation,
                description: exhibitionDesc,
                image_url: imageUrl,
                curator_id: user.id,
                curator_name: user.display_name,
            };

            let response;

            if (!exhibitionId) {
                response = await exhibitionsApi.addExhibition(payload);
                setExhibitionId(response.id);
                setHasSubmittedExhibitionOnce(true);
            } else {
                response = await exhibitionsApi.updateExhibition(
                    exhibitionId,
                    payload
                );
                console.log(response);
            }

            setIsEditingExhibition(false);
            setExhibitionSubmitted(true);

            console.log("exhibition id", response.id);
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    const handleAddCollection = () => {
        setCollections((prev) => [
            ...prev,
            {
                name: "",
                artist_name: "",
                description: "",
                image_url: "",
                image_file: null,
                uploading: false,
                uploadedName: "",
                loading: false,
                error: "",
                submittedOnce: false,
                submitted: false,
                qr_code_url: "",
            },
        ]);
    };

    const handleSubmitCollection = async (index: number) => {
        if (!exhibitionSubmitted || !exhibitionId) {
            return alert("Submit exhibition first!");
        }

        const col = collections[index];

        if (!col.image_file) {
            return alert("Unggah gambar koleksi terlebih dahulu");
        }

        setCollections((prev) => {
            const copy = [...prev];
            copy[index].loading = true;
            copy[index].uploading = true;
            copy[index].error = "";
            return copy;
        });

        try {
            const compressed = await compressImage(col.image_file, 0.7);
            const fileName = `${Date.now()}_${col.image_file.name}`;

            const { error } = await supabase.storage
                .from("collections")
                .upload(fileName, compressed);

            if (error) throw error;

            const imageUrl = supabase.storage
                .from("collections")
                .getPublicUrl(fileName).data.publicUrl;

            const createdCollection: Collection =
                await collectionsApi.createCollection({
                    name: col.name,
                    artist_name: col.artist_name,
                    artist_explanation: col.description,
                    picture_url: imageUrl,
                    ai_summary_text: "",
                });

            await exhibitionsApi.addCollectionToExhibition(exhibitionId, {
                collection_id: createdCollection.id,
                start_date: new Date().toISOString().split("T")[0],
                end_date: new Date().toISOString().split("T")[0],
            });

            setCollections((prev) => {
                const copy = [...prev];
                copy[index].loading = false;
                copy[index].uploading = false;
                copy[index].submittedOnce = true;
                copy[index].submitted = true;
                copy[index].qr_code_url = createdCollection.qr_code_url;
                return copy;
            });
        } catch (err: any) {
            setCollections((prev) => {
                const copy = [...prev];
                copy[index].loading = false;
                copy[index].error = err.message || "Terjadi kesalahan";
                return copy;
            });
        }
    };

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
        <main className="flex flex-col w-full min-h-screen bg-gradient-to-t from-blue1 via-blue1 to-[#1371AB] text-white overflow-y-auto">
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
            <div className="flex flex-col top-0 w-full max-w-screen px-6 py-24 gap-12 items-start z-10 font-sf">
                {/* Pendaftaran pameran */}
                <div className="flex flex-col gap-4 w-full">
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
                                    onChange={(e) => {
                                        setExhibitionName(e.target.value);
                                        setIsEditingExhibition(true);
                                        setExhibitionSubmitted(false);
                                    }}
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
                                    onChange={(e) => {
                                        setExhibitionLocation(e.target.value);
                                        setIsEditingExhibition(true);
                                        setExhibitionSubmitted(false);
                                    }}
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
                                    onChange={(e) => {
                                        setExhibitionDesc(
                                            e.target.value.slice(0, 500)
                                        );
                                        setIsEditingExhibition(true);
                                        setExhibitionSubmitted(false);
                                    }}
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
                                    Gambar Pameran
                                </label>

                                <label className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 cursor-pointer bg-gray-100 border rounded-lg px-3 py-2 hover:bg-gray-200 transition">
                                        <Plus className="w-4 h-4" />
                                        Unggah Gambar
                                    </div>

                                    {uploadedFileName && (
                                        <span
                                            className="flex-grow text-sm text-[#696969] max-w-[150px] truncate text-start"
                                            title={uploadedFileName}
                                        >
                                            File: {uploadedFileName}
                                        </span>
                                    )}

                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                            if (!e.target.files?.[0]) return;

                                            const file = e.target.files[0];
                                            setSelectedImageFile(file);
                                            setUploadedFileName(file.name);

                                            setIsEditingExhibition(true);
                                            setExhibitionSubmitted(false);
                                        }}
                                    />
                                </label>

                                {imageUploading && (
                                    <div className="w-full h-1 bg-gray-200 rounded overflow-hidden">
                                        <div className="h-full w-1/3 bg-blue-500 animate-pulse"></div>
                                    </div>
                                )}
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
                                    className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-[#C4C4C4] font-sf font-medium text-gray-900 text-sm rounded-full py-3 px-8"
                                    disabled={
                                        loading ||
                                        imageUploading ||
                                        exhibitionSubmitted
                                    }
                                >
                                    {loading
                                        ? "Loading..."
                                        : hasSubmittedExhibitionOnce
                                        ? "Ubah"
                                        : "Daftar"}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>

                {/* Pendaftaran koleksi */}
                {exhibitionSubmitted && (
                    <div className="flex flex-col gap-4 w-full">
                        <p className="font-bold text-2xl">Penambahan Koleksi</p>

                        {/* Add collection: satuan */}
                        {collections.map((col, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="w-full max-w-sm bg-white shadow-xl rounded-3xl p-7 pt-4 mb-4"
                            >
                                <p className="font-bold text-lg text-blue2 text-end">
                                    Koleksi {index + 1}
                                </p>
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        await handleSubmitCollection(index);
                                    }}
                                    className="flex flex-col items-center gap-4 text-black text-sm"
                                >
                                    <div className="w-full flex flex-col gap-2">
                                        <label className="w-full text-start font-medium">
                                            Judul Koleksi
                                        </label>
                                        <Input
                                            type="text"
                                            className="w-full py-6 pl-4 pr-2 border-none rounded bg-gray-100 font-sf"
                                            value={col.name}
                                            onChange={(e) =>
                                                setCollections((prev) => {
                                                    const copy = [...prev];
                                                    copy[index].name =
                                                        e.target.value;
                                                    copy[index].submitted =
                                                        false;
                                                    return copy;
                                                })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="w-full flex flex-col gap-2">
                                        <label className="w-full text-start font-medium">
                                            Nama Pencipta
                                        </label>
                                        <Input
                                            type="text"
                                            className="w-full py-6 pl-4 pr-2 border-none rounded bg-gray-100 font-sf"
                                            value={col.artist_name}
                                            onChange={(e) =>
                                                setCollections((prev) => {
                                                    const copy = [...prev];
                                                    copy[index].artist_name =
                                                        e.target.value;
                                                    copy[index].submitted =
                                                        false;
                                                    return copy;
                                                })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="w-full flex flex-col gap-2">
                                        <label className="w-full text-start font-medium">
                                            Deskripsi Koleksi
                                        </label>
                                        <textarea
                                            value={col.description}
                                            onChange={(e) =>
                                                setCollections((prev) => {
                                                    const copy = [...prev];
                                                    copy[index].description =
                                                        e.target.value;
                                                    copy[index].submitted =
                                                        false;
                                                    return copy;
                                                })
                                            }
                                            className="w-full h-32 p-4 rounded bg-gray-100 font-sf text-start resize-y overflow-auto"
                                            placeholder="Tulis deskripsi koleksi..."
                                            required
                                        />
                                        <p className="text-xs text-gray-500">
                                            {col.description.length}/500
                                            characters
                                        </p>
                                    </div>

                                    <div className="w-full flex flex-col gap-2">
                                        <label className="w-full text-start font-medium">
                                            Gambar Koleksi
                                        </label>

                                        <label className="flex items-center justify-between cursor-pointer">
                                            <div className="flex items-center gap-2 bg-gray-100 border rounded-lg px-3 py-2 hover:bg-gray-200 transition">
                                                <Plus className="w-4 h-4" />
                                                Unggah Gambar
                                            </div>

                                            {collections[index]
                                                .uploadedName && (
                                                <span
                                                    className="flex-grow text-sm text-[#696969] max-w-[150px] truncate text-start"
                                                    title={
                                                        collections[index]
                                                            .uploadedName
                                                    }
                                                >
                                                    File:{" "}
                                                    {
                                                        collections[index]
                                                            .uploadedName
                                                    }
                                                </span>
                                            )}

                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (!e.target.files?.[0])
                                                        return;

                                                    const file =
                                                        e.target.files[0];

                                                    setCollections((prev) => {
                                                        const copy = [...prev];
                                                        copy[
                                                            index
                                                        ].uploadedName =
                                                            file.name;
                                                        copy[index].image_file =
                                                            file;
                                                        copy[index].submitted =
                                                            false;
                                                        return copy;
                                                    });
                                                }}
                                            />
                                        </label>

                                        {collections[index].uploading && (
                                            <div className="w-full h-1 bg-gray-200 rounded overflow-hidden">
                                                <div className="h-full w-1/3 bg-blue-500 animate-pulse"></div>
                                            </div>
                                        )}
                                    </div>

                                    {col.error && (
                                        <p className="text-red-500">
                                            {col.error}
                                        </p>
                                    )}

                                    <div className="flex flex-row w-full items-start">
                                        {col.submitted ? (
                                            <div className="flex flex-row flex-grow gap-1 items-center font-medium text-blue2 text-sm">
                                                <Check className="w-4 h-4" />
                                                <p>Data berhasil disimpan</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-row flex-grow"></div>
                                        )}
                                        <Button
                                            type="submit"
                                            className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-[#C4C4C4] font-sf font-medium text-gray-900 text-sm rounded-full py-3 px-8"
                                            disabled={
                                                loading ||
                                                imageUploading ||
                                                col.submitted
                                            }
                                        >
                                            {loading
                                                ? "Loading..."
                                                : col.submittedOnce
                                                ? "Ubah"
                                                : "Simpan"}
                                        </Button>
                                    </div>
                                    {col.submittedOnce && (
                                        <div className="flex flex-row w-full">
                                            <div className="flex flex-row flex-grow"></div>
                                            <Button
                                                onClick={() =>
                                                    downloadQR(
                                                        col.qr_code_url,
                                                        `qr-${
                                                            collections[index]
                                                                .name ||
                                                            "collection"
                                                        }.png`
                                                    )
                                                }
                                                className="flex gap-1 items-center justify-center bg-yellow-400 hover:bg-yellow-500 font-sf font-semibold text-gray-900 text-sm rounded-full py-3 px-4"
                                            >
                                                <QrCode className="w-6 h-6" />
                                                Unduh Kode QR
                                            </Button>
                                        </div>
                                    )}
                                </form>
                            </motion.div>
                        ))}

                        <div className="flex flex-row w-full gap-3">
                            <Button
                                className="flex flex-row flex-grow gap-1 items-center rounded-full bg-[#B4EACF] hover:bg-[#78C49E] py-6 font-sf font-bold text-black text-sm"
                                onClick={handleAddCollection}
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Satuan
                            </Button>
                            <Button
                                className="flex flex-row flex-grow gap-1 items-center rounded-full bg-[#B4EACF] hover:bg-[#78C49E] disabled:text-black/40 py-6 font-sf font-bold text-black text-sm"
                                disabled
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Kolektif
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default AddExhibition;
