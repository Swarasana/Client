import { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";

// styles
import "./App.css";
import router from "./routes";
import { SplashScreen } from "./components";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [showSplash, setShowSplash] = useState(false);

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

  return (
    <>
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
    </>
  );
}

export default App;