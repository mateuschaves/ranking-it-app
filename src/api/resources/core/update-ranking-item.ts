import { api } from '~/lib/axios'

export interface UpdateRankingItemRequest {
    rankingId: string;
    rankingItemId: string;
    name?: string;
    photos?: string[];
}

export interface UpdateRankingItemResponse {
    id: string;
    name: string;
    description?: string | null;
    rankingId: string;
    updatedAt: string;
}

export async function UpdateRankingItem(request: UpdateRankingItemRequest): Promise<UpdateRankingItemResponse> {
    return api.patch(
        `/rankings/${request.rankingId}/items/${request.rankingItemId}`,
        {
            name: request.name,
            photos: request.photos,
        },
    ).then(res => res.data)
}


