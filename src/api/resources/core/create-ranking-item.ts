import { api } from '~/lib/axios'

export interface CreateRankingItemRequest {
    name:           string;
    rankingId:      string;
    photos?:        string[];
}

export interface CreateRankingItemResponse {
    id:          string;
    name:        string;
    description?: string;
    rankingId:   string;
    createdById: string;
    photos:       string[] | null;
    latitude:    number | null;
    longitude:   number | null;
    link:        string | null;
    createdAt:   string;
    updatedAt:   string;
}

export async function CreateRankingItem(request: CreateRankingItemRequest): Promise<CreateRankingItemResponse> {
    return api.post(
        `/rankings/${request.rankingId}/items`,
        {
            name: request.name,
            photos: request.photos,
        },
    ).then(res => res.data)
}