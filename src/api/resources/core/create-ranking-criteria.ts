import { api } from '~/lib/axios'

export interface CreateRankingCriteriaRequest {
    criteria:          string;
    rankingId:         string;
}

export interface CreateRankingCriteriaResponse {
    id:        string;
    rankingId: string;
    name:      string;
    createdAt: Date;
    updatedAt: Date;
}

export async function CreateRankingCriteria(request: CreateRankingCriteriaRequest): Promise<CreateRankingCriteriaResponse> {
    return api.post(
        `/rankings/${request.rankingId}/criteria`,
        {
            criteria: request.criteria,
        },
    ).then(res => res.data)
}