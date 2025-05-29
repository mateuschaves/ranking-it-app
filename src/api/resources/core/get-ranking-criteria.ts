import { api } from '~/lib/axios'

export interface GetRankingCriteriaRequest {
    id:          string;
}

export interface GetRankingCriteriaResponse  {
    id: string;
    rankingId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export async function GetRankingCriteria(request: GetRankingCriteriaRequest): Promise<GetRankingCriteriaResponse[]> {
    return api.get(
        `/rankings/${request.id}/criteria`,
    ).then(res => res.data)
}