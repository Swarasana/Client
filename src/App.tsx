import { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// styles
import "./App.css";
import router from "./routes";
import { SplashScreen, GlobalErrorBoundary, ErrorState } from "./components";
import { PWAUpdatePrompt } from "./components/PWAUpdatePrompt";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from "@/components/ui/toaster";

// Global error state
let globalErrorState: {
  error: any;
  setError: (error: any) => void;
} | null = null;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

// Set up global error handling through query cache
queryClient.getQueryCache().subscribe((event) => {
  if (event.type === 'updated' && event.query.state.status === 'error') {
    // Set global error state when any query fails
    if (globalErrorState && event.query.state.error) {
      globalErrorState.setError(event.query.state.error);
    }
  } else if (event.type === 'updated' && event.query.state.status === 'success') {
    // Clear global error state when any query succeeds
    if (globalErrorState) {
      globalErrorState.setError(null);
    }
  }
});

// Global state for PWA update
let pwaUpdateSW: ((reloadPage?: boolean) => void) | null = null;

export const setPWAUpdateCallback = (updateSW: (reloadPage?: boolean) => void) => {
  pwaUpdateSW = updateSW;
};

function App() {
  const [showSplash, setShowSplash] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [globalError, setGlobalError] = useState<any>(null);

  // Set up global error state reference
  useEffect(() => {
    globalErrorState = { error: globalError, setError: setGlobalError };
  }, [globalError]);

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

  // Handle global error retry
  const handleGlobalRetry = () => {
    setGlobalError(null);
    queryClient.refetchQueries();
  };

  // Show global error state if there's an error
  if (globalError) {
    // Determine error type based on error message
    let errorType: "network" | "server" | "generic" = "generic";
    const errorMessage = (globalError as any)?.message || String(globalError);
    
    if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('fetch')) {
      errorType = "network";
    } else if (errorMessage.toLowerCase().includes('server') || errorMessage.toLowerCase().includes('500')) {
      errorType = "server";
    }

    return (
      <ErrorState
        type={errorType}
        title="Terjadi Kesalahan"
        message="Tidak dapat memuat data saat ini. Silakan periksa koneksi internet Anda dan coba lagi."
        onRetry={handleGlobalRetry}
        fullPage={true}
      />
    );
  }

  return (
    <GlobalErrorBoundary>
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
    </GlobalErrorBoundary>
  );
}

export default App;