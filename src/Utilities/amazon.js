const puppeteer = require('puppeteer')
const fs = require('fs');

//const screenshotName = 'amazon_screenshot.png'

async function doWebScraping() {
    const browser = await ()
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0);
    await page.setViewport({ width: 1920, height: 1080 })
    await page.goto('https://www.amazon.com/s?bbn=16225007011&rh=n%3A16225007011%2Cn%3A193870011&dc&language=es&fst=as%3Aoff&qid=1603325247&rnid=16225007011&ref=lp_16225007011_nr_n_4', { waitUntil: "networkidle2" })

    await page.waitForSelector('div[class="s-result-list s-search-results sg-row"]')
    //await page.screenshot({ path: screenshotName })

    const html = await page.content();
    fs.writeFile('page.html', html, function(err) {
        if (err) throw err;

        console.log('Html Saved');
    });

    let divs = [];
    divs = await page.$$('div[class="s-result-list s-search-results sg-row"] > div')
    console.log("divs lenght = " + divs.length);
    if (divs.length <= 2)
        divs = await page.$$('div[class="s-main-slot s-result-list s-search-results sg-row"] > div')

    const articles = [];

    for (const div of divs) {
        try {
            const title = await div.$eval(("h2"), (element) => element.innerText);
            const imageUrl = await div.$eval(("img"), (element) => element.getAttribute("src"));
            let price = await div.$eval(("span[class='a-price-whole']"), (element) => element.innerText);
            const decimals = await div.$eval(("span[class='a-price-fraction']"), (element) => element.innerText);
            const olderPrice = await div.$eval(("span[class='a-price a-text-price']"), (element) => element.innerText);

            price = price.replace("\n", "") + decimals;

            const article = {
                title,
                imageUrl,
                price,
                olderPrice
            }

            articles.push(article)

        } catch (err) {
            // this occurs if any of the tags (h2, img, span) was not found
            console.log("error: ", err);
        }
    }

    await browser.close()

    return articles;
}

doWebScraping()
    .then((articles) => {
        console.log("articles: ", articles);
    })
    .catch((err) => console.log(err));