import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ApiManager from "./controllers/apiManager";
import {MySQLDatabase} from './database/mysql';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(ApiManager.getInstance().getRouter());

// Initialize database tables
async function startServer() {
  try {
    const db = MySQLDatabase.getInstance();
    await db.initializeTables();
    
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
