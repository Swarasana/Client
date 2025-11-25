import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share, ArrowDown, Plus, Download } from "lucide-react";
import { isAndroid, isIOS, isPWA, isMobileBrowser } from "@/lib/utils";

interface MobileGuardProps {
  children: React.ReactNode;
}

const MobileGuard: React.FC<MobileGuardProps> = ({ children }) => {
  const [deviceType, setDeviceType] = useState<"pwa" | "android" | "ios" | "allowed">("allowed");
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      if (isPWA()) {
        setDeviceType("pwa");
        setShowTutorial(false);
      } else if (isMobileBrowser()) {
        if (isAndroid()) {
          setDeviceType("android");
          setShowTutorial(true);
        } else if (isIOS()) {
          setDeviceType("ios");
          setShowTutorial(true);
        } else {
          setDeviceType("allowed");
          setShowTutorial(false);
        }
      } else {
        // Desktop or other devices
        setDeviceType("allowed");
        setShowTutorial(false);
      }
    };

    checkDevice();
  }, []);

  // Prevent zoom when tutorial is showing
  useEffect(() => {
    if (showTutorial) {
      // Store original viewport meta tag
      const viewport = document.querySelector('meta[name=viewport]');
      const originalContent = viewport?.getAttribute('content');
      
      // Update viewport to prevent zooming
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
      
      // Prevent touch events that could cause zoom
      const preventZoom = (e: TouchEvent) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      };
      
      const preventDoubleTapZoom = (e: TouchEvent) => {
        const now = Date.now();
        const lastTap = (e.target as any).lastTap || 0;
        const delta = now - lastTap;
        
        if (delta < 300) {
          e.preventDefault();
        }
        
        (e.target as any).lastTap = now;
      };
      
      document.addEventListener('touchstart', preventZoom, { passive: false });
      document.addEventListener('touchstart', preventDoubleTapZoom, { passive: false });
      
      return () => {
        // Restore original viewport
        if (viewport && originalContent) {
          viewport.setAttribute('content', originalContent);
        }
        
        document.removeEventListener('touchstart', preventZoom);
        document.removeEventListener('touchstart', preventDoubleTapZoom);
      };
    }
  }, [showTutorial]);

  if (deviceType === "allowed" || deviceType === "pwa") {
    return <>{children}</>;
  }

  return (
    <div className="relative overflow-x-hidden">
      {/* Render children hidden */}
      <div className="opacity-0 pointer-events-none absolute">
        {children}
      </div>

      {/* PWA Installation Tutorial Overlay */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-gradient-to-t from-blue1 via-blue1 to-blue2 z-[9999] overflow-y-auto touch-pan-y"
            style={{
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {/* Content */}
            <div className="min-h-screen w-full max-w-sm mx-auto flex flex-col items-center justify-center p-6 font-sf">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {deviceType === "android" && <AndroidTutorial />}
                {deviceType === "ios" && <IosTutorial />}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AndroidTutorial: React.FC = () => {
  const steps = [
    {
      icon: <Share />,
      title: "Tap Share Button",
      description: "Ketuk tombol bagikan (⋮) di Chrome browser",
      detail: "Biasanya terletak di pojok kanan atas browser"
    },
    {
      icon: <Plus />,
      title: "Add to Home Screen",
      description: "Pilih \"Add to Home screen\"",
      detail: "Scroll ke bawah jika tidak terlihat langsung"
    },
    {
      icon: <Download />,
      title: "Install App",
      description: "Ketuk \"Add\" untuk menginstall",
      detail: "App akan muncul di home screen seperti aplikasi native"
    }
  ];

  return (
    <div className="max-w-md mx-auto text-center text-white">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3, type: "spring", bounce: 0.3 }}
        className="mb-8"
      >
        {/* Swarasana Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="my-4 flex flex-col items-center"
        >
          <img
            src="/title.png"
            alt="Swarasana Logo"
            className="h-32 w-auto max-w-xs object-contain"
          />
        </motion.div>
        <h1 className="text-2xl font-bold mb-2">
          Install Swarasana App
        </h1>
        <p className="text-white/80 text-base">
          Untuk pengalaman terbaik, install aplikasi ini ke home screen Android Anda
        </p>
      </motion.div>

      <div className="space-y-6 mb-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-left border border-white/20"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900">
                {React.cloneElement(step.icon, { className: "w-7 h-7" })}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                <p className="text-white/90 text-sm mb-1">{step.description}</p>
                <p className="text-white/70 text-xs">{step.detail}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
      >
        <div className="flex items-center gap-3 text-yellow-400">
          <div className="animate-bounce">
            <ArrowDown className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium">
            Setelah terinstall, buka aplikasi dari home screen Anda
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const IosTutorial: React.FC = () => {
  const steps = [
    {
      icon: <Share />,
      title: "Tap Share Button",
      description: "Ketuk tombol Share di Safari browser",
      detail: "Terletak di bagian bawah layar (kotak dengan panah ke atas)"
    },
    {
      icon: <Plus />,
      title: "Add to Home Screen",
      description: "Scroll dan pilih \"Add to Home Screen\"",
      detail: "Cari ikon dengan tanda plus (+) dan rumah"
    },
    {
      icon: <Download />,
      title: "Install App",
      description: "Ketuk \"Add\" untuk menginstall",
      detail: "App akan muncul di home screen seperti aplikasi dari App Store"
    }
  ];

  return (
    <div className="max-w-md mx-auto text-center text-white">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3, type: "spring", bounce: 0.3 }}
        className="mb-8"
      >
        {/* Swarasana Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="my-4 flex flex-col items-center"
        >
          <img
            src="/title.png"
            alt="Swarasana Logo"
            className="h-32 w-auto max-w-xs object-contain"
          />
        </motion.div>
        <h1 className="text-2xl font-bold mb-2">
          Install Swarasana App
        </h1>
        <p className="text-white/80 text-base">
          Untuk pengalaman terbaik, install aplikasi ini ke home screen iPhone/iPad Anda
        </p>
      </motion.div>

      <div className="space-y-6 mb-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-left border border-white/20"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900">
                {React.cloneElement(step.icon, { className: "w-7 h-7" })}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                <p className="text-white/90 text-sm mb-1">{step.description}</p>
                <p className="text-white/70 text-xs">{step.detail}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
      >
        <div className="flex items-center gap-3 text-yellow-400">
          <div className="animate-bounce">
            <ArrowDown className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium">
            Setelah terinstall, buka aplikasi dari home screen Anda
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.3 }}
        className="mt-6 p-3 bg-orange-500/20 border border-orange-400/30 rounded-xl"
      >
        <p className="text-orange-200 text-xs">
          ⚠️ Pastikan menggunakan Safari browser, bukan Chrome atau browser lain
        </p>
      </motion.div>
    </div>
  );
};

export default MobileGuard;