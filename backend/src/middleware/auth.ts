import {NextFunction, Request, Response} from 'express';
import {AuthService} from '../services/AuthService';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  const authService = new AuthService();
  const decoded = authService.verifyToken(token);

  if (!decoded) {
    res.status(403).json({ error: 'Invalid or expired token' });
    return;
  }

  req.userId = decoded.userId;
  next();
};

export { AuthenticatedRequest };