//  include the Keyword Extractor
const keyword_extractor = require('../lib/keyword_extractor');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const serp = require('./serp');

const keywords = async () => {
    const num = 10;
    let palabras = [];
    var options = {
        host: 'google.es',
        qs: {
            q: 'raton gaming',
            filter: 0,
            pws: 0,
        },

        num,
    };

    const list = await serp.search(options);
    console.log(list);

    for (let x = 0; x < list.length; x++) {
        try {
            const webmia = await fetch(list[x].url);

            let $ = new cheerio.load(await webmia.text());

            const title = $('title').text() + ' ';
            const description =
                $('meta[name=description]').attr('content') + ' ';
            const imgarray = $('img');
            let img = '';
            let imgaltcount = 0;
            for (let i = 0; i < imgarray.length; i++) {
                if (
                    !!imgarray[i].attribs.alt &&
                    imgarray[i].attribs.alt !== ''
                ) {
                    imgaltcount++;
                }

                img += imgarray[i].attribs.alt + ' ';
            }

            const h1 = $('h1').text() + ' ';
            const h2 = $('h2').text() + ' ';
            const strong = $('strong').text() + ' ';
            const b = $('b').text() + ' ';
            const p = $('p').text() + ' ';

            let sentence = title + description + strong + img + b + p + h1 + h2;
            sentence = sentence
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
            sentence = sentence.replace(/[^\w\s]/gi, '');
            sentence = sentence.toLowerCase();

            //  Extract the keywords
            let res = keyword_extractor.extract(sentence, {
                language: 'spanish',
                remove_digits: true,
                return_changed_case: false,
                remove_duplicates: false,
            });

            let count = [];
            res.filter((v, i, a) => {
                if (a.indexOf(v) === i) {
                    count.push({ valor: v, num: 1 });
                    return true;
                } else {
                    const inds = count.findIndex((item) => {
                        return item.valor === v;
                    });
                    count[inds].num += 1;
                }
            });

            count.sort(function (a, b) {
                return b.num - a.num;
            });

            for (let y = 0; y < 40; y++) {
                if (!!count[y])
                    palabras.push({
                        valor: count[y].valor,
                        num: 40 - y + num - x,
                    });
            }
        } catch (err) {
            console.log(err);
            continue;
        }
    }
    let resfin = [];

    palabras.filter((v, i, a) => {
        if (a.map((e) => e.valor).indexOf(v.valor) === i) {
            resfin.push(v);
            return true;
        } else {
            const inds = resfin.findIndex((item) => {
                return item.valor === v.valor;
            });
            resfin[inds].num += v.num;
        }
    });

    resfin.sort(function (a, b) {
        return b.num - a.num;
    });
    const maximo = resfin[0].num;
    for (let palabra of resfin) {
        palabra.porcent = (100 * palabra.num) / maximo;
    }
    console.log('resfin', resfin);
    return resfin;
};
keywords();
