import { api } from '~/lib/axios';

export interface UpdateUserPushTokenRequest {
  pushToken: string;
}

export interface UpdateUserPushTokenResponse {
  success: boolean;
  message: string;
}

export async function UpdateUserPushToken(
  request: UpdateUserPushTokenRequest,
): Promise<UpdateUserPushTokenResponse> {
  const response = await api.post<UpdateUserPushTokenResponse>(
    '/user/push-token',
    request,
  );

  return response.data;
}
