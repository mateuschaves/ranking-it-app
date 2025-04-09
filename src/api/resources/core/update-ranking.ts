import { api } from '~/lib/axios'

export interface UpdateRankingRequest {
    bannerId: string;
    rankingId: string;
}

export async function UpdateRanking(request: UpdateRankingRequest
): Promise<void> {
    return api.put(
        `/rankings/${request.rankingId}`,
        {bannerId: request.bannerId},
    ).then(res => res.data)
}