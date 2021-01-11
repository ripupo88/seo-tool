const puppeteer = require('puppeteer');
let browser;
let page;

const fetchpage = async (url) => {
    try {
        if (browser === undefined) {
            browser = await puppeteer.launch({ headless: true });
            page = await browser.newPage();
        }

        await page.goto(url);
        await page.waitForTimeout(3000);
        const body = await page.evaluate(() => document.body.innerHTML);
        // await browser.close();
        return body;
    } catch (error) {
        console.log(error);
    }
};

module.exports = { fetchpage };
