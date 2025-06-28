import {Request, Response} from 'express';
import {z} from 'zod';
import {AuthService} from '../../services/AuthService';

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required')
});

export const registerEndpoint = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    const authService = new AuthService();
    const result = await authService.register(validatedData);
    
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors 
      });
      return;
    }
    
    if (error instanceof Error) {
      if (error.message === 'User already exists') {
        res.status(409).json({ error: error.message });
        return;
      }
    }
    
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};