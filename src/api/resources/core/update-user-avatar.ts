import { api } from '~/lib/axios';

export interface UpdateUserAvatarRequest {
  avatarId: string;
}

export async function updateUserAvatar(request: UpdateUserAvatarRequest): Promise<void> {
  await api.patch('/user/me/avatar', request);
} 