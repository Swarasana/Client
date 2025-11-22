import { useEffect, useState } from "react";
import { userApi } from "@/api";
import { Profile as ProfileType } from "@/types";

export const useUser = () => {
    const [user, setUser] = useState<ProfileType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    setUser(null);
                    setLoading(false);
                    return;
                }

                const response = await userApi.getProfile(); // assumes backend returns { user }
                setUser(response.user);
            } catch (err) {
                console.error("Failed to load user", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    return { user, loading, setUser };
};
