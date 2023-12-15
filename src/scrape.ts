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
    "document.querySelector('#box01 > figure:nth-child(15) > div:nth-child(15) > figure:nth-child(1) > div > p:nth-child(2) > span > span.font16 > span:nth-child(1) > b') != null"
  );

  const hakugei = new Selector(
    "白鯨",
    "#box01 > figure:nth-child(15) > div:nth-child(15) > figure:nth-child(1) > div > p:nth-child(1) > span:nth-child(3) > span:nth-child(2)",
    "#box01 > figure:nth-child(15) > div:nth-child(15) > figure:nth-child(1) > div > p:nth-child(2) > span > span.font16 > span:nth-child(1)"
  );
  const steelDragon = new Selector(
    "スチールドラゴン",
    "#box01 > figure:nth-child(15) > div:nth-child(15) > figure:nth-child(2) > div > p:nth-child(1) > span:nth-child(3) > span:nth-child(2)",
    "#box01 > figure:nth-child(15) > div:nth-child(15) > figure:nth-child(2) > div > p:nth-child(2) > span > span.font16 > span:nth-child(1)"
  );
  const acrobat = new Selector(
    "アクロバット",
    "#box01 > figure:nth-child(15) > div:nth-child(17) > figure:nth-child(1) > div > p:nth-child(1) > span:nth-child(4) > span",
    "#box01 > figure:nth-child(15) > div:nth-child(17) > figure:nth-child(1) > div > p:nth-child(2) > span:nth-child(1) > span"
  );
  const arashi = new Selector(
    "嵐",
    "#box01 > figure:nth-child(15) > div:nth-child(17) > figure:nth-child(2) > div > p:nth-child(1) > span:nth-child(2) > span:nth-child(2)",
    "#box01 > figure:nth-child(15) > div:nth-child(17) > figure:nth-child(2) > div > p:nth-child(2) > span:nth-child(1) > span"
  );
  const selectors = [hakugei, steelDragon, acrobat, arashi];

  // ここで必要なデータを抽出
  const elements = await Promise.all(
    selectors.map((selector) =>
      page.evaluate((selector) => {
        const operationStatus = document.querySelector(
          selector.operationStatus
        );
        const waitTime = document.querySelector(selector.waitTime);
        return {
          name: selector.name,
          operationStatus: operationStatus ? operationStatus.textContent : null,
          waitTime: waitTime ? waitTime.textContent : null,
        };
      }, selector)
    )
  );

  const attractions = elements.map((element) => {
    return new Attraction(
      element.name,
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
