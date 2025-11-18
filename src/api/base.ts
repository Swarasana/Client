import axios, { AxiosInstance, AxiosResponse } from 'axios'
// import { useAuthStore } from '@/store/auth-store'

// Core API Setup
export const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BE_URL,
    timeout: 10000,
})

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

// Generic Service Class
export class APIService {
    private api: AxiosInstance
    private basePath: string

    constructor(apiInstance: AxiosInstance, basePath: string) {
        this.api = apiInstance
        this.basePath = basePath.startsWith('/') ? basePath : `/${basePath}`
    }

    /**
     * Handles GET requests.
     * @param endpoint - The specific path after the basePath.
     * @param params - Optional query parameters.
     */
    protected async get<T>(endpoint: string, params?: Record<string, string | number | null>): Promise<T> {
        const url = `${this.basePath}${endpoint}`
        const searchParams = new URLSearchParams()

        // Append query parameters, filtering out null values
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    searchParams.append(key, String(value))
                }
            })
        }

        const queryString = searchParams.toString()
        const finalUrl = queryString ? `${url}?${queryString}` : url

        const response: AxiosResponse<T> = await this.api.get<T>(finalUrl)
        return response.data
    }

    /**
     * Handles POST requests.
     */
    protected async post<T>(endpoint: string, data: unknown): Promise<T> {
        const response: AxiosResponse<T> = await this.api.post<T>(`${this.basePath}${endpoint}`, data)
        return response.data
    }

    /**
     * Handles PUT requests.
     */
    protected async put<T>(endpoint: string, data?: unknown): Promise<T> {
        const response: AxiosResponse<T> = await this.api.put<T>(`${this.basePath}${endpoint}`, data)
        return response.data
    }
}