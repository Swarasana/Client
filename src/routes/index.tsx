import {
    Outlet,
    RouteObject,
    createBrowserRouter,
    useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import {
    Explore,
    Profile,
    Search,
    Exhibition,
    Collection,
    Login,
} from "@/pages";
import { Footer, Navbar } from "@/components";
import { motion } from "framer-motion";
import Register from "@/pages/Register";
import AddExhibition from "@/pages/AddExhibition.tsx";
import ProfileExhibitionDetail from "@/pages/ProfileExhibition";
import ProtectedRoute from "@/components/ProtectedRoute";
import DesktopGuard from "@/components/DesktopGuard";

const MainLayout = () => {
    const location = useLocation();
    const showMobileNavbar =
        location.pathname === "/" || location.pathname === "/profile";

    // Scroll to top when route changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <DesktopGuard>
            <Navbar />
            <div
                className={`md:ml-64 ${
                    showMobileNavbar ? "pb-16" : "pb-0"
                } md:pb-0 min-h-screen bg-blue1`}
            >
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{
                        duration: 0.2,
                        ease: "easeInOut",
                        type: "tween",
                    }}
                    className="w-full"
                >
                    <Outlet />
                </motion.div>
            </div>
            <Footer />
        </DesktopGuard>
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
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/profile/exhibition/:id",
                element: (
                    <ProtectedRoute protectRole="curator">
                        <ProfileExhibitionDetail />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/search",
                element: <Search />,
            },
            {
                path: "/exhibition/add",
                element: (
                    <ProtectedRoute protectRole="curator">
                        <AddExhibition />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/exhibition/:id",
                element: <Exhibition />,
            },
            {
                path: "/collection/:id",
                element: <Collection />,
            },
        ],
    },
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            {
                path: "/auth",
                element: <Explore />,
            },
        ],
    },
];

const router = createBrowserRouter(routes);

export default router;
