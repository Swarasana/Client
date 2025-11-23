import React, { useEffect, useState } from "react";

const DesktopGuard: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        const checkMobile = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <div className="relative">
            {/* Render the app normally */}
            {children}

            {/* Show overlay if desktop */}
            {!isMobile && (
                <div
                    className="
                    fixed inset-0 
                    bg-black/50 
                    backdrop-blur-md 
                    flex items-center justify-center
                    z-[9999]
                "
                >
                    <div
                        className="
                        bg-white 
                        text-black 
                        rounded-2xl 
                        p-6 
                        max-w-sm 
                        mx-4 
                        shadow-xl 
                        text-center
                    "
                    >
                        <h1 className="text-xl font-semibold mb-3">
                            Akses melalui mobile untuk pengalaman terbaik
                        </h1>
                        <p className="text-sm opacity-70 leading-relaxed">
                            Website ini hanya tersedia dalam tampilan mobile.
                            Silakan buka dari perangkat ponsel.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DesktopGuard;
