import constants from '~/config/consts';
import { api } from '~/lib/axios'

export interface GetRankingItemScoresRequest {
    rankingId:          string;
    rankingItemId:      string;
}

export interface GetRankingItemScoresResponse {
    id:              string;
    score:           number;
    rankingItemId:   string;
    user:            User;
    rankingCriteria: RankingCriteria;
}

export interface RankingCriteria {
    id:   string;
    name: string;
}

export interface User {
    id:     string;
    name:   string;
    avatar: Avatar;
}

export interface Avatar {
    id:        string;
    name:      string;
    url:       string;
    path:      string;
    mimetype:  string;
    size:      number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null;
}




export async function GetRankingItemScores(request: GetRankingItemScoresRequest): Promise<GetRankingItemScoresResponse[]> {
    const response = await api.get<GetRankingItemScoresResponse[]>(
        `/rankings/${request.rankingId}/items/${request.rankingItemId}/scores`,
    )
    return response.data;
}