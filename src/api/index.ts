import { AxiosInstance } from 'axios'
import { Collection, CursorPagination, Exhibition, PaginatedResponse } from '@/types'
import { api, APIService } from './base'


// 1. Collections API
export class CollectionsService extends APIService {
    constructor(apiInstance: AxiosInstance) {
        super(apiInstance, 'collections')
    }

    getById(id: string): Promise<Collection> {
        return this.get<Collection>(`/${id}`)
    }

    getComments(id: string, pagination: CursorPagination): Promise<PaginatedResponse<Comment>> {
        return this.get<PaginatedResponse<Comment>>(`/${id}/comments`, pagination)
    }

    addComment(id: string, data: { username: string | null; user_pic_url: string | null; comment_text: string }): Promise<Comment> {
        return this.post<Comment>(`/${id}/comments`, data) 
    }

    getAISummary(id: string): Promise<{ text: string }> {
        return this.get<{ text: string }>(`/${id}/ai-summary`)
    }
}

// 2. Comments API
export class CommentsService extends APIService {
    constructor(apiInstance: AxiosInstance) {
        super(apiInstance, 'comments')
    }

    like(id: string): Promise<Comment> {
        return this.put<Comment>(`/${id}/like`)
    }

    getText(id: string): Promise<{ text: string }> {
        return this.get<{ text: string }>(`/${id}/text`)
    }
}

// 3. Exhibitions API
export class ExhibitionsService extends APIService {
    constructor(apiInstance: AxiosInstance) {
        super(apiInstance, 'exhibitions')
    }

    getAll(pagination: CursorPagination): Promise<PaginatedResponse<Exhibition>> {
        return this.get<PaginatedResponse<Exhibition>>('', pagination)
    }

    getById(id: string): Promise<Exhibition> {
        return this.get<Exhibition>(`/${id}`)
    }

    getCollections(id: string, pagination: CursorPagination): Promise<PaginatedResponse<Collection>> {
        return this.get<PaginatedResponse<Collection>>(`/${id}/collections`, pagination)
    }
}



// Initialize and Export API Objects
export const collectionsApi = new CollectionsService(api)
export const commentsApi = new CommentsService(api)
export const exhibitionsApi = new ExhibitionsService(api)