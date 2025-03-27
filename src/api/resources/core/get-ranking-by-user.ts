import { api } from '~/lib/axios'

export interface GetRankingsByUserResponse {
    ranking: {
        id:          string;
        name:        string;
        description: string;
        photo:       string | null;
        createdAt:   Date | string;
    }
}

export async function GetRankingsByUser(
): Promise<GetRankingsByUserResponse> {
    return api.get(
        '/rankings',
    ).then(res => res.data)
}