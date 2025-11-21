"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userApi } from "@/api";
import { useNavigate } from "react-router-dom";

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
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-200">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-8"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            type="text"
            placeholder="Nama Lengkap"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="bg-gray-100"
            required
          />

          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-gray-100"
            required
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-100"
            required
          />

          <div>
            <label className="text-sm font-medium">Peranmu</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-1 bg-gray-100 border rounded-md p-2"
            >
              <option value="visitor">Pengunjung</option>
              <option value="curator">Kurator</option>
            </select>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <p className="text-center text-sm">
            Sudah punya akun?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Login di sini
            </span>
          </p>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : "Register"}
          </Button>
        </form>
      </motion.div>
    </main>
  );
};

export default Register;
