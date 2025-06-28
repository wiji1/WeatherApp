import {AuthType, createEndpointStrict} from "../types";
import {z} from "zod";
import {AuthService} from "../../services/AuthService";

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required')
}).strict();

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
  };
  token: string;
}

export const registerEndpoint = createEndpointStrict<RegisterRequest, RegisterResponse>((validate, data) => ({
  path: '/auth/register',
  method: 'post',
  auth: AuthType.None,
  validator: registerSchema,
  handler: async (req, _res) => {
    const requestData = data(req.body);
    
    const authService = new AuthService();
    const result = await authService.register(requestData);
    
    return validate(result);
  }
}));