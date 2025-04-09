import { api } from '~/lib/axios'

export interface UploadFileResponse {
    id:        string;
    name:      string;
    url:       string;
    path:      string;
    mimetype:  string;
    size:      number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null;
    RankingId: null;
}

export interface UploadFileRequest {
    attachment: FormData;
}

export async function UploadFile(attachment: FormData
): Promise<UploadFileResponse> {
    return api.post(
        '/attachments',
        attachment,
    ).then(res => res.data)
}