import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ApiManager from "./controllers/apiManager";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(ApiManager.getInstance().getRouter());

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
