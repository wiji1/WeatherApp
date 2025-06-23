import {z} from 'zod';
import {AuthType, createEndpointStrict} from "./types";

const archiveFileSchema = z.object({
    path: z.string().min(1),
}).strict();

export type ArchiveFileRequest = z.infer<typeof archiveFileSchema>;

export interface ArchiveFileResponse {
    message: string,
    archivePath: string
    path: string
}

export const secondTestEndpoint = createEndpointStrict<ArchiveFileRequest, ArchiveFileResponse>((validate, data) => ({
    path: '/tests',
    method: 'get',
    auth: AuthType.Basic,
    validator: archiveFileSchema,
    handler: async (req, res) => {
        const requestData = data(req.query);

        return validate({
            message: 'File archived successfully',
            archivePath: '/path/to/archive.zip',
            path: requestData.path
        })
    }
}));