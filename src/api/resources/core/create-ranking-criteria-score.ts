import { api } from '~/lib/axios'

export interface CreateRankingCriteriaScoreRequest {
    rankingItemId: string;
    rankingId:   string;
    rankingCriteriaId:  string;
    score:         number;
}

export interface CreateRankingCriteriaScoreResponse {
    id:                string;
    rankingItemId:     string;
    rankingCriteriaId: string;
    userId:            string;
    score:             number;
    createdAt:         Date;
    updatedAt:         Date;
}

export async function CreateRankingCriteriaScore(request: CreateRankingCriteriaScoreRequest): Promise<CreateRankingCriteriaScoreResponse> {
    return api.post(
        `/rankings/${request.rankingId}/items/${request.rankingItemId}/scores`, {
            rankingCriteriaId: request.rankingCriteriaId,
            score: request.score,
        }
    ).then(res => res.data)
}