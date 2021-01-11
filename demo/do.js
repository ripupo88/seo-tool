//  include the Keyword Extractor
const keyword_extractor = require('../lib/keyword_extractor');
const cheerio = require('cheerio');
const { fetchpage } = require('./puppeteer');
const serp = require('./serp');

// Variables //
const num = 50;
let allKeywordsCount = [];
const options = {
    host: 'google.es',
    qs: {
        q: 'raton razer',
        filter: 0,
        pws: 0,
    },
    num,
};

excludesURL = [
    'amazon.com',
    'amazon.es',
    'pccomponentes',
    'mediamarkt',
    'youtube.com',
    'game.es',
    '.elcorteingles.es',
    'wallapop.com',
    'fnac.es',
];

exludesCount = 0;

const keywords = async () => {
    let list = await serp.search(options);
    console.log('list antes', list);
    list = list.filter((item) => {
        let resp = true;
        for (let exclude of excludesURL) {
            if (item.url.indexOf(exclude) > -1) {
                resp = false;
            }
        }
        return resp;
    });

    console.log('list despues', list);
    for (let x = 0; x < list.length; x++) {
        try {
            const webmia = await fetchpage(list[x].url);
            let $ = new cheerio.load(await webmia);
            let textInElements = getTextFromElements($);
            textInElements = normalizeText(textInElements);

            //  Extract the keywords
            let onlyKeywords = keyword_extractor.extract(textInElements, {
                language: 'spanish',
                remove_digits: true,
                return_changed_case: false,
                remove_duplicates: false,
            });

            let keywordsCount = [];
            onlyKeywords.filter((v, i, a) => {
                if (a.indexOf(v) === i) {
                    keywordsCount.push({ valor: v, num: 1 });
                    return true;
                } else {
                    const inds = keywordsCount.findIndex((item) => {
                        return item.valor === v;
                    });
                    keywordsCount[inds].num += 1;
                }
            });

            keywordsCount.sort(function (a, b) {
                return b.num - a.num;
            });

            for (let y = 0; y < 40; y++) {
                if (!!keywordsCount[y])
                    allKeywordsCount.push({
                        valor: keywordsCount[y].valor,
                        num: 40 - y + num - x,
                    });
            }
        } catch (err) {
            console.log(err);
            continue;
        }
    }

    let finalKeywords = [];

    allKeywordsCount.filter((v, i, a) => {
        if (a.map((e) => e.valor).indexOf(v.valor) === i) {
            finalKeywords.push(v);
            return true;
        } else {
            const inds = finalKeywords.findIndex((item) => {
                return item.valor === v.valor;
            });
            finalKeywords[inds].num += v.num;
        }
    });

    finalKeywords.sort(function (a, b) {
        return b.num - a.num;
    });
    const maximo = finalKeywords[0].num;
    for (let palabra of finalKeywords) {
        palabra.porcent = (100 * palabra.num) / maximo;
    }
    console.log('finalKeywords', finalKeywords);
    return finalKeywords;
};
keywords();

/**
 * Normalize text to lowercase and delete special char
 *
 * @param {string} cherrio web page loaded
 * @returns {string} all text from every element
 */
function normalizeText(textInElements) {
    textInElements = textInElements
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    textInElements = textInElements.replace(/[^\w\s]/gi, '');
    textInElements = textInElements.toLowerCase();
    return textInElements;
}

/**
 * Get text from web page in some elements
 *
 * @param {object} cherrio web page loaded
 * @returns {string} all text from every element
 */
function getTextFromElements($) {
    const title = $('title').text() + ' ';
    const description = $('meta[name=description]').attr('content') + ' ';
    const imgArray = $('img');
    let imgText = '';

    for (let i = 0; i < imgArray.length; i++) {
        imgText += imgArray[i].attribs.alt + ' ';
    }

    let textFromElements = '';
    getTextFrom = ['h1', 'h2', 'h3', 'h5', 'h6', 'p', 'b', 'strong'];
    for (let eachElement of getTextFrom) {
        $(eachElement).each(function (index, value) {
            var k = $(this).text();
            textFromElements += k + ' ';
        });
    }
    return title + description + imgText + textFromElements;
}
