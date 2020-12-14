const puppeteer = require('puppeteer')
const fs = require('fs');
const Article = require('../Models/Article');

exports.GetNeweggProducts = async function(url) {

    try{
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.setViewport({ width: 1920, height: 1080 })
        await page.goto(url, { waitUntil: "networkidle2" });
    
        await page.waitForSelector('div[class="item-cells-wrap border-cells items-grid-view four-cells expulsion-one-cell"]');
    
        let divs = [];
        divs = await page.$$('div[class="item-cells-wrap border-cells items-grid-view four-cells expulsion-one-cell"] > div');
        let articles = [];
        var counter = 0;
        for (const div of divs) {
            if(counter === 5)
                break;

            try {
                
                const imageUrl = await div.$eval(('img'), (element) => element.getAttribute("src"));
    
                const prodUrl = await div.$eval(('a'), (element) => element.getAttribute("href"));
    
                const title = await div.$eval(('a[class="item-title"]'), (element) => element.innerText);
    
                const article = {
                    title,
                    imageUrl,
                    prodUrl
                };

                articles.push(article);
            } catch (err) {
                console.log(err);
            }

            counter++;
        }
    
        await browser.close();
    
        return [true,articles];
        
    }catch(error){
        console.log(error);
        return [false,error];
    } 
};

exports.GetProductPrice = async function GetProductPrice(prodURL) {
    try {
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
        const page = await browser.newPage()
        await page.setDefaultNavigationTimeout(0);
        await page.setViewport({ width: 1920, height: 1080 })
        await page.goto(prodURL, { waitUntil: "networkidle2" })
        await page.waitForSelector("li[class='price-current']")

        const html = await page.content();

        //Get the price
        var price;
        try {
            price = await page.$eval(("li[class='price-current']"), (element) => element.innerText);
            price = parseFloat(price.replace( /^\D+/g, ''));
        } catch (error) {
            price = null;
        }

        //Get availabilty
        var in_stock;
        try {
            let availability = await page.$eval(("div[class='product-inventory']"), (element) => element.innerText);
            if ( availability === " OUT OF STOCK.")
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