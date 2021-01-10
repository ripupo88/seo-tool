const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('https://sex.com/');
        await page.setViewport({
            width: 1200,
            height: 800,
        });
        await page.waitForTimeout(10000);
        await autoScroll(page);
        // const IMAGE_SELECTOR =
        //     ;'div.masonry_box small_pin_box > a.image_wrapper > img.lazy-loaded'
        let imageHref = await page.evaluate(() => {
            const imgs = document.querySelectorAll(
                'div.masonry_box > a.image_wrapper > img.lazy-loaded'
            );
            let href = [];
            for (let img of imgs) {
                href.push(img.src);
            }
            return href;
        });
        let cont = 0;
        console.log(imageHref);
        for (let imgon of imageHref) {
            let viewSource = await page.goto(imgon);
            cont++;
            fs.writeFile(
                cont + '.webp',
                await viewSource.buffer(),
                function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log('The file was saved!');
                }
            );
        }
        await browser.close();
    } catch (error) {
        console.log(error);
    }
})();

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
