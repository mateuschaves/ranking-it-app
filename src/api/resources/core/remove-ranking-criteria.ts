import { api } from '~/lib/axios'

export interface RemoveRankingCriteriaRequest {
    criteriaId:          string;
    rankingId:         string;
}

export interface RemoveRankingCriteriaResponse {
    id:        string;
    rankingId: string;
    name:      string;
    createdAt: Date;
    updatedAt: Date;
}

export async function RemoveRankingCriteria(request: RemoveRankingCriteriaRequest): Promise<RemoveRankingCriteriaResponse> {
    return api.delete(
        `/rankings/${request.rankingId}/criteria/${request.criteriaId}`,
    ).then(res => res.data)
}