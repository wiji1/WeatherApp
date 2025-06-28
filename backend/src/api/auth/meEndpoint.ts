import {AuthType, createEndpointStrict} from "../types";
import {z} from "zod";
import {AuthService} from "../../services/AuthService";

const meSchema = z.object({}).strict();

export interface MeRequest {}

export interface MeResponse {
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
  };
}

export const meEndpoint = createEndpointStrict<MeRequest, MeResponse>((validate, data) => ({
  path: '/auth/me',
  method: 'get',
  auth: AuthType.Basic,
  validator: meSchema,
  handler: async (req, _res) => {
    const authService = new AuthService();
    const user = await authService.getUserById(req.auth!.userId!);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return validate({ user });
  }
}));