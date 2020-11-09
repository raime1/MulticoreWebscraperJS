const puppeteer = require('puppeteer')
const fs = require('fs');
const Article = require('../Models/Article');

exports.DoNeweggWebScrapping = async function() {

    try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.setViewport({ width: 1920, height: 1080 })
        await page.goto('https://www.newegg.com/todays-deals?cm_sp=homepage_dailydeal-_--_-11022020&quicklink=true', { waitUntil: "networkidle2" });
    
        await page.waitForSelector('div[class="item-cells-wrap tile-cells five-cells"]');
    
        let divs = [];
        divs = await page.$$('div[class="item-cells-wrap tile-cells five-cells"] > div');
        const articles = [];
    
        for (const div of divs) {
    
            try {
                
                const imageUrl = await div.$eval(('img'), (element) => element.getAttribute("src"));
    
                const prodUrl = await div.$eval(('a'), (element) => element.getAttribute("href"));
    
                const title = await div.$eval(('a[class="item-title"]'), (element) => element.innerText);
    
                const price = await div.$eval(('li[class="price-current"]'), (element) => element.innerText);
    
                try {
                    let oldPrice = await div.$eval(('li[class="price-was"]'), (element) => element.innerText);
                    const article = new Article(
                        title,
                        imageUrl,
                        prodUrl,
                        price,
                        oldPrice
                    );
    
                    articles.push(article)
                } catch (error) {
                    const article = new Article(
                        title,
                        imageUrl,
                        prodUrl,
                        price,
                        price
                    );
    
                    articles.push(article);     
                }
                
            } catch (err) {
    
            }
        }
    
        await browser.close();
    
        return [true,articles];
    }catch(error){
        return [false,error];
    }
    
    
}