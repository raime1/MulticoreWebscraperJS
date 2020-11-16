const puppeteer = require('puppeteer')
const fs = require('fs');
const Article = require('../Models/Article');

exports.DoNeweggWebScrappingST = async function() {

    try{
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
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

exports.DoNeweggWebScrapping = async function() {

    try{
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.setViewport({ width: 1920, height: 1080 })
        await page.goto('https://www.newegg.com/todays-deals?cm_sp=homepage_dailydeal-_--_-11022020&quicklink=true', { waitUntil: "networkidle2" });
    
        await page.waitForSelector('div[class="item-cells-wrap tile-cells five-cells"]');
    
        let divs = [];
        divs = await page.$$('div[class="item-cells-wrap tile-cells five-cells"] > div');
        let articles = [];

        const promisesArticles = [];
        //promisesArticles.push(processDivs(divs.slice(1,divs.length/2)));
        //promisesArticles.push(processDivs(divs.slice((divs.length/2)+1,divs.length)));
        promisesArticles.push(processDivs(divs.splice(1,divs.length/2)));
        promisesArticles.push(processDivs(divs));
        
        
        return Promise.all(promisesArticles)
        .then(async (results) => {
            articles = articles.concat(results[0], results[1]);
            await browser.close();
            return [true,articles];
        })
        .catch(async (error) => {
            await browser.close();
            return [false,error];
        });
        /*
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
        */
    }catch(error){
        return [false,error];
    } 
}

function processDivs(divs){
    return new Promise(async (resolve, refuse) => {
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
        resolve(articles);
    });
}