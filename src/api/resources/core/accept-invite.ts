import { api } from '~/lib/axios';

export interface AcceptInviteRequest {
  inviteId: string;
}
 
export async function acceptInvite(request: AcceptInviteRequest): Promise<void> {
  await api.post('/ranking-invites/accept', request);
} 