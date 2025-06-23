import {AuthType, createEndpointStrict} from "./types";

export interface testResponse {
    message: string;
}

export const testEndpoint = createEndpointStrict<unknown, testResponse>((validate) => ({
    path: '/test',
    method: 'get',
    auth: AuthType.Basic,
    handler: async (req, res) => {
        return validate({
            message: 'This is a test endpoint response'
        });
    }
}));