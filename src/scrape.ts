// scrape.ts
import { Attraction } from "./models/attraction";
import { Selector } from "./models/selector";
import puppeteer from "puppeteer";

async function scrapeWebsite() {
  const url = process.env.SCRAPING_URL;
  if (!url) {
    console.error("SCRAPING_URL is not defined");
    return;
  }
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });

  await page.waitForFunction(
    "document.querySelector('#attraction01 > span') != null"
  );

  const jsonSelectors = process.env.SELECTORS;
  if (!jsonSelectors) {
    console.error("SELECTORS is not defined");
    return;
  }
  const json = JSON.parse(jsonSelectors);
  const selectors: Selector[] = json.selectors;

  // ここで必要なデータを抽出
  const elements = await Promise.all(
    selectors.map((selector: Selector) =>
      page.evaluate((selector) => {
        const operationStatus = document.querySelector(
          selector.operationStatus
        );
        const waitTime = document.querySelector(selector.waitTime);
        return {
          name: selector.name,
          selector: selector,
          operationStatus: operationStatus ? operationStatus.textContent : null,
          waitTime: waitTime ? waitTime.textContent : null,
        };
      }, selector)
    )
  );

  const attractions = elements.map((element) => {
    return new Attraction(
      element.name,
      element.selector,
      element.operationStatus,
      element.waitTime
    );
  });

  attractions.forEach((attraction) => {
    console.log(
      `${attraction.name}: ${
        attraction.textContent.operationStatus
      }, ${attraction.waitTime()}`
    );
  });

  await browser.close();
}

scrapeWebsite();
