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

async function startServer() {
  const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

  try {
    const db = MySQLDatabase.getInstance();
    await db.initializeTables();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

startServer();
