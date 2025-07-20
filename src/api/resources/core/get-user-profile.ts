import { api } from '~/lib/axios';

export interface GetUserProfileResponse {
  id: string;
  name: string;
  email: string;
  avatarId: string;
  avatarUrl?: string;
  createdAt: string;
  pendingInvitesCount: number;
}

export async function getUserProfile(): Promise<GetUserProfileResponse> {
  const response = await api.get<GetUserProfileResponse>('/user/me/profile');
  return response.data;
} 