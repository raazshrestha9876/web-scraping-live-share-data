import { scrapeLiveTradingData } from "../utils/scraper.js";

export const scrapeWebsite = async () => {
    const url = 'https://merolagani.com/latestmarket.aspx';
    return await scrapeLiveTradingData(url);
};