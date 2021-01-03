//  include the Keyword Extractor
var keyword_extractor = require('../lib/keyword_extractor');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

const mifun = async () => {
    // const busqueda = await fetch(
    //     'https://www.google.com/search?rlz=1C1GCEA_enES926ES927&sxsrf=ALeKk03a69VI-xTiNfBq9-0p18EmGKfwZw%3A1609702954436&ei=Kh7yX9yOGqedlwSYvYqQBg&q=raspberry+pi+4+4gb&oq=raspberry+pi+4+&gs_lcp=CgZwc3ktYWIQAxgDMgQIIxAnMgIIADICCAAyAggAMgIIADICCAAyAggAMgIIADICCAAyAggAOgQIABBDOgUIABCxAzoICAAQsQMQgwE6CAgAEMcBEK8BOgIILjoHCAAQsQMQQzoFCC4QsQNQ7dQVWJn7FWCVtRZoAHABeAGAAZ8GiAHyC5IBCTAuMS4yLjYtMZgBAKABAaoBB2d3cy13aXrAAQE&sclient=psy-ab'
    // )
        .then((res) => {
            return res.text();
        })
        .catch((err) => console.log(err));

    console.log(busqueda);
    $ = cheerio.load(busqueda);
    const list = $('div.g div.rc div.yuRUbf>a');

    // for (i = 0; i < list.length; i++) {
    //     console.log(list[i].attribs.href);
    //     const webmia = await fetch(list[i].attribs.href);

    //     $ = cheerio.load(await webmia.text());

    //     const title = $('title').text() + ' ';
    //     const description = $('meta[name=description]').attr('content') + ' ';
    //     const imgarray = $('img');
    //     let img = '';
    //     let imgaltcount = 0;
    //     for (i = 0; i < imgarray.length; i++) {
    //         if (!!imgarray[i].attribs.alt && imgarray[i].attribs.alt !== '') {
    //             imgaltcount++;
    //         }

    //         img += imgarray[i].attribs.alt + ' ';
    //     }

    //     const h1 = $('h1').text() + ' ';
    //     const h2 = $('h2').text() + ' ';
    //     const strong = $('strong').text() + ' ';
    //     const b = $('b').text() + ' ';
    //     const p = $('p').text() + ' ';

    //     const sentence = title + description + strong + img + b + p + h1 + h2;

    //     //  Extract the keywords
    //     let res = keyword_extractor.extract(sentence, {
    //         language: 'spanish',
    //         remove_digits: true,
    //         return_changed_case: false,
    //         remove_duplicates: false,
    //     });

    //     console.log('total', res.length);

    //     for (i = 0; i < res.length; i++) {
    //         res[i] = res[i].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    //         res[i] = res[i].toLowerCase();
    //     }

    //     let count = [];
    //     res.filter((v, i, a) => {
    //         if (a.indexOf(v) === i) {
    //             count.push({ valor: v, num: 1 });
    //             return true;
    //         } else {
    //             const inds = count.findIndex((item) => {
    //                 return item.valor === v;
    //             });
    //             count[inds].num += 1;
    //         }
    //     });

    //     count.sort(function (a, b) {
    //         return b.num - a.num;
    //     });

    //     console.log('fotos', imgarray.length);
    //     console.log('fotos con ALT', imgaltcount);
    //     console.log('palabras totales', res.length);
    //     console.log('palabras unicas', count.length);
    //     console.log(count[0]);
    //     console.log(count[1]);
    //     console.log(count[2]);
    //     console.log(count[3]);
    //     console.log(count[4]);
    //     console.log(count[5]);
    //     console.log(count[6]);
    //     console.log(count[7]);
    //     console.log(count[8]);
    //     console.log(count[9]);
    //     console.log(count[10]);
    //     console.log(count[11]);
    //     console.log(count[12]);
    // }
};

mifun();
