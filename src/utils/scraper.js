import axios from "axios";
import { load } from "cheerio";

export const scrapeLiveTradingData = async (url) => {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    const $ = load(html);
    const scrapedData = [];
    // Select the table using the specific ID
    $("#ctl00_ContentPlaceHolder1_LiveTrading table tbody tr").each(
      (_, element) => {
        const row = {};
        row.symbol = $(element).find("td").eq(0).text().trim();
        row.ltp = $(element).find("td").eq(1).text().trim();
        row.changePercent = $(element).find("td").eq(2).text().trim();
        row.open = $(element).find("td").eq(3).text().trim();
        row.high = $(element).find("td").eq(4).text().trim();
        row.low = $(element).find("td").eq(5).text().trim();
        row.quantity = $(element).find("td").eq(6).text().trim();
        scrapedData.push(row);
      }
    );

    return scrapedData;
  } catch (error) {
    console.error("Error scraping live trading data:", error.message);
    return [];
  }
};
