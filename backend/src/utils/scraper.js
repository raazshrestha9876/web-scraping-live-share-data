import puppeteer from "puppeteer";
import { load } from "cheerio";

const parseNumber = (str) => {
  // Handle Unicode minus (U+2212) and standardize numeric format
  const cleaned = str
    .replace(/−/g, "-")  // Replace Unicode minus with standard hyphen
    .replace(/,|%| |,/g, "") // Remove commas, percentages, and spaces
    .trim();

  return parseFloat(cleaned) || null; // Return null for invalid numbers
};

export const scrapeLiveTradingData = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36");
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 }); // Increased timeout

  // Wait for critical elements
  await Promise.all([
    page.waitForSelector("#headFixed thead tr", { timeout: 30000 }),
    page.waitForSelector("#headFixed tbody tr", { timeout: 30000 }),
  ]);

  const html = await page.content();
  const $ = load(html);

  // Column index mapping
  const columnMap = {};
  $("#headFixed thead tr th").each((index, el) => {
    const title = $(el).text().trim().toLowerCase();
    switch(title) {
      case "s.no": columnMap.sno = index; break;
      case "symbol": columnMap.symbol = index; break;
      case "ltp": columnMap.ltp = index; break;
      case "point change": columnMap.pointChange = index; break;
      case "% change": columnMap.changePercent = index; break;
      case "open": columnMap.open = index; break;
      case "high": columnMap.high = index; break;
      case "low": columnMap.low = index; break;
      case "volume": columnMap.quantity = index; break;
      case "prev. close": columnMap.prevClose = index; break;
    }
  });

  // Validate required columns
  if (typeof columnMap.pointChange === "undefined" || typeof columnMap.prevClose === "undefined") {
    throw new Error("Critical columns not found in table header");
  }

  // Data extraction
  const scrapedData = [];
  $("#headFixed tbody tr").each((_, row) => {
    const tds = $(row).find("td");
    if (tds.length >= 10) { // Verify expected column count
      scrapedData.push({
        sno: parseNumber(tds.eq(columnMap.sno).text()),
        symbol: tds.eq(columnMap.symbol).text().trim(),
        ltp: parseNumber(tds.eq(columnMap.ltp).text()),
        pointChange: parseNumber(tds.eq(columnMap.pointChange).text()),
        changePercent: parseNumber(tds.eq(columnMap.changePercent).text()),
        open: parseNumber(tds.eq(columnMap.open).text()),
        high: parseNumber(tds.eq(columnMap.high).text()),
        low: parseNumber(tds.eq(columnMap.low).text()),
        quantity: parseNumber(tds.eq(columnMap.quantity).text()),
        prevClose: parseNumber(tds.eq(columnMap.prevClose).text()),
      });
    }
  });

  await browser.close();
  return scrapedData;
};