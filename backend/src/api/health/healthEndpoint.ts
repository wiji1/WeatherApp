import {AuthType, createEndpoint} from "../types";

export interface HealthResponse {
  status: string;
  timestamp: string;
}

export const healthEndpoint = createEndpoint<void, HealthResponse>({
  path: '/health',
  method: 'get',
  auth: AuthType.None,
  handler: async (req, res) => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString()
    };
  }
});