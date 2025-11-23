"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userApi } from "@/api";
import { useNavigate } from "react-router-dom";
import headerPattern from "@/assets/images/header-pattern.svg";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await userApi.login({ username, password });
            const { token } = response;

            localStorage.setItem("authToken", token);
            localStorage.setItem("role", response.user.role);
            localStorage.setItem("username", response.user.username);
            localStorage.setItem("userId", response.user.id);
            navigate(`/`);
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message || "Login gagal");
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
                    Login
                </h1>

                <form
                    onSubmit={handleLogin}
                    className="flex flex-col items-center space-y-5"
                >
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

                    {error && (
                        <p className="w-full font-sf text-red-500 text-sm text-start pb-2 pl-2">
                            {error}
                        </p>
                    )}

                    <p className="w-full flex flex-row justify-center gap-1 pb-2 font-sf text-blue2 text-sm">
                        Belum punya akun?{" "}
                        <a
                            onClick={() => navigate("/register")}
                            className="font-bold"
                        >
                            Daftar akun baru
                        </a>
                    </p>

                    <Button
                        type="submit"
                        className="bg-yellow-400 hover:bg-yellow-500 font-sf font-semibold text-gray-900 text-xl rounded-full py-6 px-12"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Login"}
                    </Button>
                </form>
            </motion.div>
        </main>
    );
};

export default Login;
