import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
    children,
    protectRole,
}: {
    children: JSX.Element;
    protectRole?: string;
}) {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (protectRole && role !== protectRole) {
        return <Navigate to="/" replace />;
    }

    return children;
}
