import { api } from '~/lib/axios'

export interface SignUpWithEmailAndPasswordRequest {
    email: string
    password: string
    name?: string
}

export interface SignUpWithEmailAndPasswordResponse {
    accessToken: string;
    expiresIn: string;
}

export async function SignUpWithEmailAndPassword(
    request: SignUpWithEmailAndPasswordRequest,
): Promise<SignUpWithEmailAndPasswordResponse> {
    return api.post(
        '/user/signup',
        request,
    ).then(res => res.data)
}