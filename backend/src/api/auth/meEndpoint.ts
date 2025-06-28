import {Response} from 'express';
import {AuthenticatedRequest} from '../../middleware/auth';
import {AuthService} from '../../services/AuthService';

export const meEndpoint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const authService = new AuthService();
    const user = await authService.getUserById(req.userId!);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Me endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};