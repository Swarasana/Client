import React from "react";
import { motion } from "framer-motion";
import { RefreshCw, AlertTriangle, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  type?: "network" | "server" | "generic" | "not-found";
  onRetry?: () => void;
  showRetry?: boolean;
  fullPage?: boolean;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  type = "generic",
  onRetry,
  showRetry = true,
  fullPage = false,
  className = ""
}) => {
  const getErrorContent = () => {
    switch (type) {
      case "network":
        return {
          icon: <WifiOff className="w-16 h-16 text-red-400" />,
          defaultTitle: "Koneksi Bermasalah",
          defaultMessage: "Periksa koneksi internet Anda dan coba lagi"
        };
      case "server":
        return {
          icon: <AlertTriangle className="w-16 h-16 text-yellow-400" />,
          defaultTitle: "Server Sedang Bermasalah",
          defaultMessage: "Terjadi masalah pada server kami. Silakan coba lagi nanti"
        };
      case "not-found":
        return {
          icon: <AlertTriangle className="w-16 h-16 text-blue-400" />,
          defaultTitle: "Data Tidak Ditemukan",
          defaultMessage: "Data yang Anda cari tidak ditemukan"
        };
      default:
        return {
          icon: <AlertTriangle className="w-16 h-16 text-red-400" />,
          defaultTitle: "Terjadi Kesalahan",
          defaultMessage: "Mohon maaf, terjadi kesalahan yang tidak terduga"
        };
    }
  };

  const { icon, defaultTitle, defaultMessage } = getErrorContent();

  const containerClasses = fullPage
    ? "flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue1 via-blue1 to-blue2 text-white p-4"
    : "flex flex-col items-center justify-center py-12 px-4";

  return (
    <div className={`${containerClasses} ${className}`}>
      <motion.div
        className="flex flex-col items-center text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Error Icon with Animation */}
        <motion.div
          className="mb-6"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm">
            {icon}
          </div>
        </motion.div>

        {/* Error Title */}
        <motion.h2
          className="text-xl font-bold mb-3 text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {title || defaultTitle}
        </motion.h2>

        {/* Error Message */}
        <motion.p
          className="text-white/80 text-center leading-relaxed mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {message || defaultMessage}
        </motion.p>

        {/* Retry Button */}
        {showRetry && onRetry && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button
              onClick={onRetry}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              <RefreshCw className="w-4 h-4" />
              Coba Lagi
            </Button>
          </motion.div>
        )}

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/10 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.7, 0.3],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorState;