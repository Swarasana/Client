import { Outlet, RouteObject, createBrowserRouter, useLocation } from "react-router-dom";
import { Explore, Profile } from "@/pages";
import { Footer, Navbar } from "@/components";
import { motion } from "framer-motion";
// import { AuthProvider } from "@/contexts/AuthContext";

const MainLayout = () => {
    const location = useLocation();
    
    return (
        <>
            <Navbar />
            <div className="md:ml-64 pb-20 md:pb-0 min-h-screen">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ 
                        duration: 0.2, 
                        ease: "easeInOut",
                        type: "tween"
                    }}
                    className="w-full"
                >
                    <Outlet />
                </motion.div>
            </div>
            <Footer />
        </>
    );
};

const AuthLayout = () => {
    return <Outlet />;
};

const routes: RouteObject[] = [
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <Explore />,
            },
            {
                path: "/profile",
                element: <Profile />,
            }
        ],
    },
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            {
                path: "/auth",
                element: <Explore />,
            }
        ],
    },
];

const router = createBrowserRouter(routes);

export default router;