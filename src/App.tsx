import { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// styles
import "./App.css";
import router from "./routes";
import { SplashScreen } from "./components";
import { PWAUpdatePrompt } from "./components/PWAUpdatePrompt";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Global state for PWA update
let pwaUpdateSW: ((reloadPage?: boolean) => void) | null = null;

export const setPWAUpdateCallback = (updateSW: (reloadPage?: boolean) => void) => {
  pwaUpdateSW = updateSW;
};

function App() {
  const [showSplash, setShowSplash] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  useEffect(() => {
    // Check if app is running as PWA or on mobile
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isFirstVisit = !localStorage.getItem('hasVisited');

    // Show splash screen
    if (isPWA || (isMobile && isFirstVisit) || new URLSearchParams(window.location.search).has('splash')) {
      setShowSplash(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handlePWAUpdate = () => {
    if (pwaUpdateSW) {
      pwaUpdateSW(true);
    }
    setShowUpdatePrompt(false);
  };

  const handlePWAUpdateDismiss = () => {
    setShowUpdatePrompt(false);
  };

  // Expose function to trigger update prompt
  useEffect(() => {
    (window as any).showPWAUpdatePrompt = () => {
      setShowUpdatePrompt(true);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SplashScreen 
        isVisible={showSplash} 
        onAnimationComplete={handleSplashComplete} 
      />
      
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <RouterProvider router={router} />
      <PWAUpdatePrompt
        isOpen={showUpdatePrompt}
        onUpdate={handlePWAUpdate}
        onDismiss={handlePWAUpdateDismiss}
      />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;