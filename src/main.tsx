import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App, { setPWAUpdateCallback } from './App.tsx'
import './index.css'
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    setPWAUpdateCallback(updateSW);
    // Trigger the update prompt through the global function
    if ((window as any).showPWAUpdatePrompt) {
      (window as any).showPWAUpdatePrompt();
    }
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
