import { api } from '~/lib/axios'

export interface GetRankingCriteriaSuggestRequest {
    id:          string;
}

export interface GetRankingCriteriaSuggestResponse {
    criteria:    string[];
    rankingId:   string;
    rankingName: string;
}

export async function GetRankingCriteriaSuggest(request: GetRankingCriteriaSuggestRequest): Promise<GetRankingCriteriaSuggestResponse> {
    return api.get(
        `/rankings/${request.id}/suggest-criteria`,
    ).then(res => res.data)
}