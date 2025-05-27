import express from 'express';
import { scrapeRoute } from './routes/scrapeRoute.js';
import cors from 'cors';
import connectDB from './config/db.js';

const app = express();

connectDB();

app.use(express.json());
app.use(cors());
app.use('/api/scrape', scrapeRoute);

export default app;

