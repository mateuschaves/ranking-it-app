import constants from '~/config/consts';
import { getImageUrl } from '~/utils/image';
import { api } from '~/lib/axios'

export interface GetRankingItemsRequest {
    id:          string;
}

export interface GetRankingItemsResponse {
    id:                   string;
    name:                 string;
    description:          null;
    photo:                null;
    latitude:             null;
    longitude:            null;
    link:                 null;
    createdAt:            Date;
    updatedAt:            Date;
    rankingItemUserPhoto: RankingItemUserPhoto[];
    createdByUser:        CreatedByUser;
    score:                number;
}

export interface CreatedByUser {
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

export interface RankingItemUserPhoto {
    id:      string;
    photoId: string;
    userId:  string;
    photo:   Photo;
}

export interface Photo {
    url: string;
    uri?: string;
}



export async function GetRankingItems(request: GetRankingItemsRequest): Promise<GetRankingItemsResponse[]> {
    const response = await api.get<GetRankingItemsResponse[]>(
        `/rankings/${request.id}/items`,
    )

    return response.data.map(item => ({
        ...item,
        createdByUser: {
            ...item.createdByUser,
            avatar: {
                ...item.createdByUser.avatar,
                uri: item.createdByUser.avatar.url
                ? getImageUrl(item.createdByUser.avatar.url)
                : undefined,
            }
        },
        rankingItemUserPhoto: item.rankingItemUserPhoto.map(photo => ({
            ...photo,
            photo: {
                ...photo.photo,
                uri: photo.photo.url
                    ? getImageUrl(photo.photo.url)
                    : undefined,
            }
        }))
    }))
}