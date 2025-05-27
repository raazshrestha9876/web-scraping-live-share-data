import { scrapeLiveTradingData } from "../utils/scraper.js";

export const scrapeWebsite = async () => {
    const url = 'https://www.sharesansar.com/live-trading';
    return await scrapeLiveTradingData(url);
};