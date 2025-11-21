"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userApi } from "@/api";
import { useNavigate } from "react-router-dom";

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

            // Save token (localStorage or cookies)
            localStorage.setItem("authToken", token);

            // router.push("/explore");
            navigate(`/`);
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-200">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-8"
            >
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

                <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-gray-100"
                    />

                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-100"
                    />

                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                    <p>
                        Belum punya akun?{" "}
                        <a
                            onClick={() => navigate("/register")}
                            className="text-blue-600 cursor-pointer hover:underline"
                        >
                            Daftar akun baru
                        </a>
                    </p>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Login"}
                    </Button>
                </form>
            </motion.div>
        </main>
    );
}

export default Login;