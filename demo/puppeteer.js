const puppeteer = require('puppeteer');

const google = async (url) => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(url);
        const body = await page.evaluate(() => document.body.innerHTML);
        await browser.close();
        return body;
    } catch (error) {
        console.log(error);
    }
};

module.exports = { google };
