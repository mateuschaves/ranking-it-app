import { api } from '~/lib/axios'

export interface GetRankingsByUserResponse {
    id:          string;
    name:        string;
    description: string;
    banner:      Banner;
    createdAt:   Date;
}
export interface Banner {
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


export async function GetRankingsByUser(
): Promise<GetRankingsByUserResponse[]> {
    return api.get(
        '/rankings',
    ).then(res => res.data)
}