import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {MySQLDatabase} from '../database/mysql';
import {AuthResponse, User, UserLogin, UserRegistration} from '../models/User';

export class AuthService {
  private db: MySQLDatabase;
  private jwtSecret: string;

  constructor() {
    this.db = MySQLDatabase.getInstance();
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  }

  async register(userData: UserRegistration): Promise<AuthResponse> {
    const { email, password, name } = userData;

    const existingUsers = await this.db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = this.generateId();

    await this.db.execute(
      'INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)',
      [userId, email, hashedPassword, name]
    );

    const user: Omit<User, 'password'> = {
      id: userId,
      email,
      name,
      createdAt: new Date()
    };

    const token = this.generateToken(userId);

    return { user, token };
  }

  async login(credentials: UserLogin): Promise<AuthResponse> {
    const { email, password } = credentials;

    const users = await this.db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      throw new Error('Invalid credentials');
    }

    const userRow = users[0];
    const isPasswordValid = await bcrypt.compare(password, userRow.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const user: Omit<User, 'password'> = {
      id: userRow.id,
      email: userRow.email,
      name: userRow.name,
      createdAt: new Date(userRow.created_at)
    };

    const token = this.generateToken(userRow.id);

    return { user, token };
  }

  async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
    const users = await this.db.query('SELECT id, email, name, created_at FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return null;
    }

    const userRow = users[0];
    return {
      id: userRow.id,
      email: userRow.email,
      name: userRow.name,
      createdAt: new Date(userRow.created_at)
    };
  }

  verifyToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string };
      return decoded;
    } catch {
      return null;
    }
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, this.jwtSecret, { expiresIn: '7d' });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}