import { api } from '~/lib/axios';
 
export async function declineInvite(inviteId: string): Promise<void> {
  await api.delete(`/ranking-invites/decline/${inviteId}`);
} 