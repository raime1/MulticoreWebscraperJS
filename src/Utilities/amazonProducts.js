const puppeteer = require('puppeteer')
const fs = require('fs');
const Article = require('../Models/Article');

exports.GetAmazonProducts = async function GetAmazonProducts(prodURL) {
    try {

        const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
        const page = await browser.newPage()
        await page.setDefaultNavigationTimeout(0);
        await page.setViewport({ width: 1920, height: 1080 })
        await page.goto(prodURL, { waitUntil: "networkidle2" })
        await page.waitForSelector('div[class="s-result-list s-search-results sg-row"]')
    
        const html = await page.content();
    
        let divs = [];
        divs = await page.$$('div[class="s-result-list s-search-results sg-row"] > div')
        console.log("divs lenght = " + divs.length);
        if (divs.length <= 2)
            divs = await page.$$('div[class="s-main-slot s-result-list s-search-results sg-row"] > div')
    
        const articles = [];
    
        var counter = 0;
        for (const div of divs) {
            if(counter == 5)
                break;
            try {
                const title = await div.$eval(("h2"), (element) => element.innerText);
                const imageUrl = await div.$eval(("img"), (element) => element.getAttribute("src"));
                const prodUrl = 'https://www.amazon.com' + await div.$eval(("a"), (element) => element.getAttribute("href"));
                const store = 0;
                
                const article = {
                    store,
                    title,
                    imageUrl,
                    prodUrl
                }

                articles.push(article)

            } catch (err) {
                // this occurs if any of the tags (h2, img, span) was not found
                console.log("error: ", err);
            }
            counter++;
        }
    
        await browser.close();
    
        return [true,articles];
    }catch(error){
        return [false,error];
    }
}

exports.GetProductPrice = async function GetProductPrice(prodURL) {
    try {
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
        const page = await browser.newPage()
        await page.setDefaultNavigationTimeout(0);
        await page.setViewport({ width: 1920, height: 1080 })
        await page.goto(prodURL, { waitUntil: "networkidle2" })
        await page.waitForSelector("span[class='a-size-large product-title-word-break'")

        const html = await page.content();

        //Get the price
        var price;
        try {
            price = await page.$eval(("span[class='a-size-medium a-color-price priceBlockBuyingPriceString'"), (element) => element.innerText);
            price = parseFloat(price.replace( /^\D+/g, ''));
            
        } catch (error) {
            price = null;
        }

        //Get availabilty
        var in_stock;
        try {
            let availability = await page.$eval(("span[class='a-size-medium a-color-price']"), (element) => element.innerText);
            console.log(availability);
            if ( availability === "No disponible por el momento.")
                in_stock = false;
            else
                in_stock = true;
        } catch (error) {
            in_stock = true;
        }

        const historial = {
            price,
            in_stock
        }

        await browser.close();
        return [true, historial];

    }catch(error){
        return [false,error];
    }
}
