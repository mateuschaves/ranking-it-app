import { api } from '~/lib/axios'

export interface SignInWithEmailAndPasswordRequest {
    email: string
    password: string
}

export interface SignInWithEmailAndPasswordResponse {
    accessToken: string;
    expiresIn: string;
}

export async function SignUpWithEmailAndPassword(
    request: SignInWithEmailAndPasswordRequest,
): Promise<SignInWithEmailAndPasswordResponse> {
    return api.post(
        '/user/signin',
        request,
    )
}