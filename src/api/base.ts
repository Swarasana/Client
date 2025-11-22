import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ApiResponse } from "@/types";
// import { useAuthStore } from '@/store/auth-store'

// Core API Setup
export const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BE_URL,
    timeout: 10000,
});

export const apiAuth: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BE_URL,
    timeout: 10000,
});

/*
// Request Interceptor for Authentication
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
*/

apiAuth.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("TOKEN:", token);
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem("authToken");
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

// Generic Service Class
export class APIService {
    private api: AxiosInstance;
    private basePath: string;

    constructor(apiInstance: AxiosInstance, basePath: string) {
        this.api = apiInstance;
        this.basePath = basePath.startsWith("/") ? basePath : `/${basePath}`;
    }

    /**
     * Handles GET requests.
     * @param endpoint - The specific path after the basePath.
     * @param params - Optional query parameters.
     */
    protected async get<T>(
        endpoint: string,
        params?: Record<string, string | number | null>
    ): Promise<T> {
        const url = `${this.basePath}${endpoint}`;
        const searchParams = new URLSearchParams();

        // Append query parameters, filtering out null values
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    searchParams.append(key, String(value));
                }
            });
        }

        const queryString = searchParams.toString();
        const finalUrl = queryString ? `${url}?${queryString}` : url;

        const response: AxiosResponse<ApiResponse<T>> = await this.api.get<
            ApiResponse<T>
        >(finalUrl);

        // Handle error response
        if (!response.data.success) {
            const errorMessage =
                response.data.error?.message || "API request failed";
            throw new Error(errorMessage);
        }

        // Return the data from ApiResponse wrapper
        return response.data.data as T;
    }

    /**
     * Handles POST requests.
     */
    protected async post<T>(endpoint: string, data: unknown): Promise<T> {
        const response: AxiosResponse<ApiResponse<T>> = await this.api.post<
            ApiResponse<T>
        >(`${this.basePath}${endpoint}`, data);

        // Handle error response
        if (!response.data.success) {
            const errorMessage =
                response.data.error?.message || "API request failed";
            throw new Error(errorMessage);
        }

        // Return the data from ApiResponse wrapper
        return response.data.data as T;
    }

    /**
     * Handles PUT requests.
     */
    protected async put<T>(endpoint: string, data?: unknown): Promise<T> {
        const response: AxiosResponse<ApiResponse<T>> = await this.api.put<
            ApiResponse<T>
        >(`${this.basePath}${endpoint}`, data);

        // Handle error response
        if (!response.data.success) {
            const errorMessage =
                response.data.error?.message || "API request failed";
            throw new Error(errorMessage);
        }

        // Return the data from ApiResponse wrapper
        return response.data.data as T;
    }
}
