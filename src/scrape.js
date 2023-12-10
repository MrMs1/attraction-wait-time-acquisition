"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// scrape.ts
const attraction_1 = require("./models/attraction");
const selector_1 = require("./models/selector");
const puppeteer_1 = __importDefault(require("puppeteer"));
function scrapeWebsite() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = process.env.SCRAPING_URL;
        if (!url) {
            console.error("SCRAPING_URL is not defined");
            return;
        }
        const browser = yield puppeteer_1.default.launch({ headless: "new" });
        const page = yield browser.newPage();
        yield page.goto(url, { waitUntil: "networkidle0" });
        yield page.waitForFunction("document.querySelector('#box01 > figure:nth-child(15) > div:nth-child(15) > figure:nth-child(1) > div > p:nth-child(2) > span > span.font16 > span:nth-child(1) > b') != null");
        const hakugei = new selector_1.Selector("白鯨", "#box01 > figure:nth-child(15) > div:nth-child(15) > figure:nth-child(1) > div > p:nth-child(1) > span:nth-child(3) > span:nth-child(2)", "#box01 > figure:nth-child(15) > div:nth-child(15) > figure:nth-child(1) > div > p:nth-child(2) > span > span.font16 > span:nth-child(1)");
        const steelDragon = new selector_1.Selector("スチールドラゴン", "#box01 > figure:nth-child(15) > div:nth-child(15) > figure:nth-child(2) > div > p:nth-child(1) > span:nth-child(3) > span:nth-child(2)", "#box01 > figure:nth-child(15) > div:nth-child(15) > figure:nth-child(2) > div > p:nth-child(2) > span > span.font16 > strong");
        const acrobat = new selector_1.Selector("アクロバット", "#box01 > figure:nth-child(15) > div:nth-child(17) > figure:nth-child(1) > div > p:nth-child(1) > span:nth-child(4) > span", "#box01 > figure:nth-child(15) > div:nth-child(17) > figure:nth-child(1) > div > p:nth-child(2) > span:nth-child(1) > span");
        const arashi = new selector_1.Selector("嵐", "#box01 > figure:nth-child(15) > div:nth-child(17) > figure:nth-child(2) > div > p:nth-child(1) > span:nth-child(2) > span:nth-child(2)", "#box01 > figure:nth-child(15) > div:nth-child(17) > figure:nth-child(2) > div > p:nth-child(2) > span:nth-child(1) > span");
        const selectors = [hakugei, steelDragon, acrobat, arashi];
        // ここで必要なデータを抽出
        const elements = yield Promise.all(selectors.map((selector) => page.evaluate((selector) => {
            const operationStatus = document.querySelector(selector.operationStatus);
            const waitTime = document.querySelector(selector.waitTime);
            return {
                name: selector.name,
                operationStatus: operationStatus ? operationStatus.textContent : null,
                waitTime: waitTime ? waitTime.textContent : null,
            };
        }, selector)));
        const attractions = elements.map((element) => {
            return new attraction_1.Attraction(element.name, element.operationStatus, element.waitTime);
        });
        attractions.forEach((attraction) => {
            console.log(`${attraction.name}: ${attraction.textContent.operationStatus}, ${attraction.textContent.waitTime}`);
        });
        yield browser.close();
    });
}
scrapeWebsite();
