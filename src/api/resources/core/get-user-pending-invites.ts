import { api } from '~/lib/axios';

export interface PendingInvite {
  id: string;
  rankingName: string;
  createdAt: string;
  inviterName: string;
  inviterAvatarPath: string | null;
}

export async function getUserPendingInvites(): Promise<PendingInvite[]> {
  const response = await api.get<PendingInvite[]>('/user/me/pending-invites');
  return response.data;
} 