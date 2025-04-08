import { api } from '~/lib/axios'

export interface SignInWithEmailAndPasswordRequest {
    email: string
    password: string
}

export interface SignInWithEmailAndPasswordResponse {
    accessToken: string;
    expiresIn: string;
}

export async function SignInWithEmailAndPassword(
    request: SignInWithEmailAndPasswordRequest,
): Promise<SignInWithEmailAndPasswordResponse> {
    return api.post(
        '/user/signin',
        request,
    ).then(res => res.data)
}