import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to format date/time
export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInSeconds < 30) {
    return 'Baru saja';
  } else if (diffInSeconds < 60) {
    return `${diffInSeconds} detik yang lalu`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  } else if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  } else if (diffInDays < 7) {
    return `${diffInDays} hari yang lalu`;
  } else {
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  }
};

// Auth utility functions
export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  // Force redirect to login page
  window.location.href = "/login";
};

// Mobile device detection utilities
export const isMobileDevice = (): boolean => {
  return window.innerWidth < 768;
};

export const isAndroid = (): boolean => {
  return /Android/i.test(navigator.userAgent);
};

export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/i.test(navigator.userAgent);
};

export const isPWA = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches;
};

export const isMobileBrowser = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export type MobileDeviceType = "android" | "ios" | "desktop" | "pwa";

// Error handling utilities
export interface ErrorInfo {
  type: "network" | "server" | "not-found" | "forbidden" | "unauthorized" | "generic";
  title: string;
  message: string;
  showRetry: boolean;
  retryAction?: () => void;
}

export const categorizeError = (error: any): ErrorInfo => {
  // Network/Connection errors
  if (!navigator.onLine) {
    return {
      type: "network",
      title: "Tidak Ada Koneksi Internet",
      message: "Periksa koneksi internet Anda dan coba lagi",
      showRetry: true
    };
  }

  // Axios/HTTP errors
  if (error?.response) {
    const status = error.response.status;
    
    switch (status) {
      case 404:
        return {
          type: "not-found", 
          title: "Halaman Tidak Ditemukan",
          message: "Halaman atau data yang Anda cari tidak ditemukan. Periksa URL atau kembali ke halaman utama.",
          showRetry: true
        };
      
      case 401:
        return {
          type: "unauthorized",
          title: "Sesi Anda Berakhir", 
          message: "Silakan login kembali untuk melanjutkan",
          showRetry: true,
          retryAction: () => logout()
        };
      
      case 403:
        return {
          type: "forbidden",
          title: "Akses Ditolak",
          message: "Anda tidak memiliki izin untuk mengakses halaman ini",
          showRetry: true
        };
      
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: "server",
          title: "Server Sedang Bermasalah",
          message: "Terjadi masalah pada server kami. Silakan coba lagi dalam beberapa menit.",
          showRetry: true
        };
      
      default:
        return {
          type: "server", 
          title: "Terjadi Kesalahan Server",
          message: "Server mengalami masalah. Silakan coba lagi atau hubungi support jika masalah berlanjut.",
          showRetry: true
        };
    }
  }

  // Network request failed (no response)
  if (error?.request) {
    return {
      type: "network",
      title: "Gagal Terhubung ke Server", 
      message: "Tidak dapat terhubung ke server. Periksa koneksi internet Anda atau coba lagi nanti.",
      showRetry: true
    };
  }

  // Generic JavaScript errors
  return {
    type: "generic",
    title: "Terjadi Kesalahan Aplikasi",
    message: "Aplikasi mengalami kesalahan yang tidak terduga. Silakan muat ulang halaman.",
    showRetry: true,
    retryAction: () => window.location.reload()
  };
};
