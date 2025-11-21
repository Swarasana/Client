"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userApi } from "@/api";
import { useNavigate } from "react-router-dom";
import headerPattern from "@/assets/images/header-pattern.svg";
import visitor from "@/assets/images/visitor.png";
import curator from "@/assets/images/anton.png";

const Register: React.FC = () => {
    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("visitor");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await userApi.register({
                display_name: displayName,
                username,
                password,
                role,
            });

            navigate("/login");
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue1 via-blue1 to-[#1371AB] overflow-hidden">
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
                <img
                    src={headerPattern}
                    alt="Motif latar belakang"
                    className="w-full"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-sm bg-white shadow-xl rounded-3xl p-7"
            >
                <h1 className="text-3xl font-sf font-bold text-center text-blue1 mb-6">
                    Register
                </h1>

                <form
                    onSubmit={handleRegister}
                    className="flex flex-col items-center space-y-5"
                >
                    <Input
                        type="text"
                        placeholder="Nama Lengkap"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full py-6 pl-4 pr-2 border-none rounded-md bg-gray-100 font-sf text-lg"
                        required
                    />

                    <Input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full py-6 pl-4 pr-2 border-none rounded-md bg-gray-100 font-sf text-lg"
                        required
                    />

                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full py-6 pl-4 pr-2 border-none rounded-md bg-gray-100 font-sf text-lg"
                        required
                    />

                    <div className="w-full pb-2">
                        <label className="w-full font-sf text-xl font-bold text-blue1 text-start">
                            Pilih peranmu
                        </label>

                        <div className="flex flex-row mt-3 gap-5">
                            <div
                                onClick={() => setRole("visitor")}
                                className="flex flex-col items-center justify-center"
                            >
                                <div
                                    className={`flex items-center justify-center w-24 h-24 md:w-24 md:h-24 bg-[#78C49E] p-1.5 rounded-full border-4
                                    ${
                                        role == "visitor"
                                            ? "border-yellow-400"
                                            : "border-[#78C49E]"
                                    }`}
                                >
                                    <img
                                        src={visitor}
                                        alt="Ikon pengunjung"
                                        className="w-full"
                                    />
                                </div>
                                <p className="font-sf font-bold text-blue1 text-base">
                                    Pengunjung
                                </p>
                            </div>
                            <div
                                onClick={() => setRole("curator")}
                                className="flex flex-col items-center justify-center"
                            >
                                <div
                                    className={`flex items-center justify-center w-24 h-24 md:w-24 md:h-24 bg-[#78C49E] p-0 rounded-full border-4
                                    ${
                                        role == "curator"
                                            ? "border-yellow-400"
                                            : "border-[#78C49E]"
                                    }`}
                                >
                                    <img
                                        src={curator}
                                        alt="Ikon kurator"
                                        className="w-full"
                                    />
                                </div>
                                <p className="font-sf font-bold text-blue1 text-base">
                                    Kurator
                                </p>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error}
                        </p>
                    )}

                    <p className="w-full flex flex-row justify-center gap-1 font-sf text-blue2 text-sm">
                        Sudah punya akun?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            className="font-bold"
                        >
                            Login di sini
                        </span>
                    </p>

                    <Button
                        type="submit"
                        className="bg-yellow-400 hover:bg-yellow-500 font-sf font-semibold text-gray-900 text-xl rounded-full py-6 px-12"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Register"}
                    </Button>
                </form>
            </motion.div>
        </main>
    );
};

export default Register;
