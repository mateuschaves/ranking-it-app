import { api } from '~/lib/axios'

export interface CreateRankingResponse {
    id:          string;
    ownerId:     string;
    name:        string;
    description: string;
    photo:       string;
    createdAt:   Date | string;
    updatedAt:   Date | string;
}

export interface CreateRankingRequest {
    name: string;
    description: string;
}

export async function CreateRanking(request: CreateRankingRequest
): Promise<CreateRankingResponse> {
    return api.post<CreateRankingResponse>(
        '/rankings',
        request
    ).then(res => res.data)
}