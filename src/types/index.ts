// Base API Response
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: {
        message: string;
        stack?: string;
    };
}

export interface CursorPagination {
    cursor: string | null;
    limit: string | null;
    [key: string]: string | null | number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        nextCursor: string | null;
        hasMore: boolean;
        totalCount?: number;
    };
}

export interface User {
    id: string;
    username: string;
    user_pic_url: string | null;
    role: "curator" | "visitor";
    created_at: string;
    updated_at: string;
}

export interface Profile {
    id: string;
    username: string;
    display_name: string;
    user_pic_url: string | null;
    role: "curator" | "visitor";
    created_at: string;
    updated_at: string;
    password: string;
    points: number;
    level: UserLevel;
    comments: UserComment[];
}

export interface UserComment {
    id: string;
    comment_text: string;
    likes_count: number;
    collection_id: string;
    collection_name: string;
    exhibition_name: string;
}

export interface UserLevel {
    id: string;
    level_name: string;
    minimum_points: number;
}

export interface Level {
    id: string;
    level_number: number;
    level_name: string;
    desc: string;
    minimum_points: number;
    avatar_url: string;
}

export interface Merch {
    id: number;
    name: string;
    desc: string;
    price: number;
    exhibition: string;
}

export interface Collection {
    id: string;
    name: string;
    picture_url: string;
    artist_name: string;
    artist_explanation: string;
    ai_summary_text: string;
    likes_count: number;
    created_at: string;
    updated_at: string;
    qr_code_url: string;
}

export interface AddExhibitionResponse {
    success: boolean;
    data: Exhibition;
    message: string;
}

// Visitor Counter Types
export interface VisitorCount {
    visitorCount: number;
}

export interface TrackVisit {
    isNewVisit: boolean;
    totalVisitorCount: number;
}

export interface TrendingCollection {
    collection_id: string;
    recent_visits: number;
}

export interface VisitorAnalytics {
    totalVisits: number;
    uniqueVisitors: number;
    visitsLast7Days: number;
    visitsToday: number;
}

export interface Comment {
    id: string;
    collection_id: string;
    username: string;
    user_pic_url: string | null;
    comment_text: string;
    likes_count: number;
    created_at: string;
    updated_at: string;
}

export interface Exhibition {
    id: string;
    name: string;
    description: string;
    curator_id: string;
    curator_name: string;
    location: string;
    image_url: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    username: string;
    user_pic_url: string | null;
    role: "curator" | "visitor";
    created_at: string;
    updated_at: string;
    display_name: string;
    password: string;
    points: number;
}
