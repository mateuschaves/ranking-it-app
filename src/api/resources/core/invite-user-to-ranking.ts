import { api } from '~/lib/axios'

export interface InviteUserToRankingRequest {
  email: string;
  rankingId: string;
}

export interface InviteUserToRankingResponse {
  // Defina os campos esperados na resposta, se houver. Caso não saiba, pode deixar vazio ou ajustar depois.
}

export async function InviteUserToRanking(request: InviteUserToRankingRequest): Promise<InviteUserToRankingResponse> {
  return api.post(
    `/rankings/${request.rankingId}/invite`,
    {
      email: request.email,
      rankingId: request.rankingId,
    },
  ).then(res => res.data)
} 