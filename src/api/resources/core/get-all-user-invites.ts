import { api } from '~/lib/axios';

export interface UserInvite {
  id: string;
  rankingName: string;
  createdAt: string;
  inviterName: string;
  inviterAvatarPath: string | null;
}

interface ApiInvite {
  id: string;
  createdAt: string;
  ranking: {
    name: string;
  };
  invitedBy: {
    name: string;
    avatar: {
      url: string;
    } | null;
  };
}

interface GetAllUserInvitesResponse {
  invites: ApiInvite[];
  count: number;
}

export async function getAllUserInvites(): Promise<UserInvite[]> {
  const response = await api.get<GetAllUserInvitesResponse>('/ranking-invites/my-invites');
  return response.data.invites.map(invite => ({
    id: invite.id,
    rankingName: invite.ranking.name,
    createdAt: invite.createdAt,
    inviterName: invite.invitedBy.name,
    inviterAvatarPath: invite.invitedBy.avatar?.url || null,
  }));
} 