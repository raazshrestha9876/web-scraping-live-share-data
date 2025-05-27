import express from 'express';
import { addScrapedData, getScrapeData } from '../controllers/scrapeController.js';

const router = express.Router();

router.post('/', addScrapedData);
router.get('/', getScrapeData);

export { router as scrapeRoute };