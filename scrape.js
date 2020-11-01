const request = require('request-promise');
const cheerio = require('cheerio');

(async function() {
    try {
        const base = 'https://www.newegg.com/todays-deals';
        const mainHtml = await request(base);
        const $ = cheerio.load(mainHtml);

        const links = $('.item-container').map((i, section) => {
            const $product = $(section).find('.item-title');
            //return $product.text();
            //return $product.attr('href');
            const $priceWas = $(section).find('price-was-data');
            // const $priceCurrent = $(section).find('li.price-current');

            return {
                link: $product.attr('href'),
                name: $product.text(),
                oldPrice: $priceWas.text()
                // currentPrice: $priceCurrent.text()
            }
        }).get();

        // const data = await Promise.all(links.map(async (product) => {
        //     try {
        //         const productHtml = await request(product.link);
        //         const $ = cheerio.load(productHtml);

        //         const lis = $('#price > li');
        //         const prices = lis.map((i, li) => {
        //             return {
        //                 oldPrice: $(li).find('.price-was-data').text(),
        //                 currentPrice: $(li).find('.strong').text()
        //             }
        //         }).get();

        //         console.log(prices);

        //     } catch (error) {
        //          return e.message;
        //     }
        // }));

        console.log(links);

    } catch (error) {
        console.log('our error:', error);
    }
})();