export interface CursorPagination {
  cursor: string | null
  limit: string | null
  [key: string]: string | null | number
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
  role: 'curator' | 'visitor';
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  name: string;
  picture_url: string;
  artist_name: string;
  artist_explanation: string;
  ai_summary_text: string;
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
}