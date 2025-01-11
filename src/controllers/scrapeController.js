import { Scrape } from "../models/Scrape.js";
import { scrapeWebsite } from "../services/scrapeService.js";

export const addScrapedData = async (req, res) => {
  try {
    const scrapedData = await scrapeWebsite();
    const data = scrapedData.map((data) => ({
      symbol: data.symbol,
      ltp: parseFloat(data.ltp),
      changePercent: parseFloat(data.changePercent),
      open: parseFloat(data.open),
      high: parseFloat(data.high),
      low: parseFloat(data.low),
      quantity: parseFloat(data.quantity),
    }));

    const savedData = await Scrape.create(data);

    res.status(200).json(savedData);
  } catch (error) {
    // Error handling
    res.status(500).json({ message: error.message });
  }
};

export const getScrapeData = async (req, res) => {
    try {
        const scrapeData = await Scrape.find().sort({ createdAt: -1 });
        res.status(200).json(scrapeData);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

