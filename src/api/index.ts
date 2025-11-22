import { AxiosInstance } from "axios";
import {
    Collection,
    CursorPagination,
    Exhibition,
    PaginatedResponse,
    VisitorCount,
    TrackVisit,
    TrendingCollection,
    VisitorAnalytics,
    User,
    Merch,
    Level,
} from "@/types";
import { api, apiAuth, APIService } from "./base";

// 1. Collections API
export class CollectionsService extends APIService {
    constructor(apiInstance: AxiosInstance) {
        super(apiInstance, "collections");
    }

    getById(id: string): Promise<Collection> {
        return this.get<Collection>(`/${id}`);
    }

    getComments(
        id: string,
        pagination: CursorPagination
    ): Promise<PaginatedResponse<Comment>> {
        return this.get<PaginatedResponse<Comment>>(
            `/${id}/comments`,
            pagination
        );
    }

    addComment(
        id: string,
        data: {
            username: string | null;
            user_pic_url: string | null;
            comment_text: string;
        }
    ): Promise<Comment> {
        return this.post<Comment>(`/${id}/comments`, data);
    }

    like(id: string): Promise<Collection> {
        return this.put<Collection>(`/${id}/like`);
    }

    getAISummary(id: string): Promise<{ text: string }> {
        return this.get<{ text: string }>(`/${id}/ai-summary`);
    }
}

// 2. Comments API
export class CommentsService extends APIService {
    constructor(apiInstance: AxiosInstance) {
        super(apiInstance, "comments");
    }

    like(id: string): Promise<Comment> {
        return this.put<Comment>(`/${id}/like`);
    }

    getText(id: string): Promise<{ text: string }> {
        return this.get<{ text: string }>(`/${id}/text`);
    }

    getCommentCollection(id: string): Promise<any> {
        return this.get(`/comments/${id}/collection`);
    }
}

// 3. Exhibitions API
export class ExhibitionsService extends APIService {
    constructor(apiInstance: AxiosInstance) {
        super(apiInstance, "exhibitions");
    }

    getAll(
        pagination: CursorPagination
    ): Promise<PaginatedResponse<Exhibition>> {
        return this.get<PaginatedResponse<Exhibition>>("", pagination);
    }

    getById(id: string): Promise<Exhibition> {
        return this.get<Exhibition>(`/${id}`);
    }

    getCollections(
        id: string,
        pagination: CursorPagination
    ): Promise<PaginatedResponse<Collection>> {
        return this.get<PaginatedResponse<Collection>>(
            `/${id}/collections`,
            pagination
        );
    }
}

// 4. Visitors API
export class VisitorsService extends APIService {
    constructor(apiInstance: AxiosInstance) {
        super(apiInstance, "visitors");
    }

    getVisitorCount(collectionId: string): Promise<VisitorCount> {
        return this.get<VisitorCount>(
            `/collections/${collectionId}/visitor-count`
        );
    }

    trackVisit(collectionId: string, sessionId?: string): Promise<TrackVisit> {
        return this.post<TrackVisit>(
            `/collections/${collectionId}/visit`,
            sessionId ? { session_id: sessionId } : {}
        );
    }

    getTrending(
        limit: number = 10
    ): Promise<{ trending: TrendingCollection[] }> {
        return this.get<{ trending: TrendingCollection[] }>(
            `/trending?limit=${limit}`
        );
    }

    getAnalytics(collectionId: string): Promise<VisitorAnalytics> {
        return this.get<VisitorAnalytics>(
            `/collections/${collectionId}/analytics`
        );
    }
}

// 5. Users API
export class UserService extends APIService {
    constructor(apiInstance: AxiosInstance) {
        super(apiInstance, "users");
    }

    async login(data: {
        username: string;
        password: string;
    }): Promise<{ token: string }> {
        const res = await api.post("/users/login", data);
        return res.data;
    }

    async register(data: {
        username: string;
        password: string;
        display_name: string;
        role: string;
    }) {
        const res = await api.post("users/register", data);
        return res.data;
    }

    async getProfile() {
        const res = await apiAuth.get("/users/me");
        return res.data;
    }
}

// 6. Levels API
export class LevelService extends APIService {
    constructor(apiInstance: AxiosInstance) {
        super(apiInstance, "levels");
    }

    getLevels(): Promise<Level[]> {
        return this.get("/");
    }
}

// 7. Merchandises API
export class MerchService extends APIService {
    constructor(apiInstance: AxiosInstance) {
        super(apiInstance, "merch");
    }

    getMerch(): Promise<Merch[]> {
        return this.get("/");
    }
}

// Initialize and Export API Objects
export const collectionsApi = new CollectionsService(api);
export const commentsApi = new CommentsService(api);
export const exhibitionsApi = new ExhibitionsService(api);
export const visitorsApi = new VisitorsService(api);
export const userApi = new UserService(api);
export const levelsApi = new LevelService(api);
export const merchApi = new MerchService(api);
