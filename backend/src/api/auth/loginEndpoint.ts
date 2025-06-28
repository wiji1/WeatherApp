import {AuthType, createEndpointStrict} from "../types";
import {z} from "zod";
import {AuthService} from "../../services/AuthService";

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
}).strict();

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
  };
  token: string;
}

export const loginEndpoint = createEndpointStrict<LoginRequest, LoginResponse>((validate, data) => ({
  path: '/auth/login',
  method: 'post',
  auth: AuthType.None,
  validator: loginSchema,
  handler: async (req, _res) => {
    const requestData = data(req.body);
    
    const authService = new AuthService();
    const result = await authService.login(requestData);
    
    return validate(result);
  }
}));