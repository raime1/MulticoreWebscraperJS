const { promises } = require('fs');
const puppeteer = require('puppeteer')

exports.DoCPUBenchmarkScrappingST = async function() {
    try{
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.setDefaultNavigationTimeout(0);
        await page.setViewport({ width: 1920, height: 1080 })
        await page.goto('https://www.tomshardware.com/reviews/cpu-hierarchy,4312.html', { waitUntil: "networkidle2" })
    
        const html = await page.content();
    
        const benchmarks = [];
    
        //let tableDiv = await page.$$('div[class="articletable"] > div')
        const result = await page.$$eval('table tr', rows => {
            return Array.from(rows, row => {
              const columns = row.querySelectorAll('td');
              return Array.from(columns, column => column.innerText);
            });
        });
        
        for(var i = 1; i < 12; i++){
            // console.log(result[i][0]);
            const name = result[i][0];          //Name of the processor
            const GS1080p = result[i][1];       //Gaming Score 1080p
            const family = result[i][3];        //Processor family
            const coresThreads = result[i][4];  //Cores/Threads
            const baseBoost = result[i][5];     //Base frecuency and boost frequency
            const TDP = result[i][6];           //Power consumption
    
            const benchmark = {
                name,
                GS1080p,
                family,
                coresThreads,
                baseBoost,
                TDP
            }
    
            benchmarks.push(benchmark);
        }
        for(var i = 17; i < 46; i++){
            // console.log(result[i][0]);
            const name = result[i][0];          //Name of the processor
            const GS1080p = result[i][1];       //Gaming Score 1080p
            const family = result[i][2];        //Processor family
            const coresThreads = result[i][3];  //Cores/Threads
            const baseBoost = result[i][4];     //Base frecuency and boost frequency
            const TDP = result[i][5];           //Power consumption
    
            const benchmark = {
                name,
                GS1080p,
                family,
                coresThreads,
                baseBoost,
                TDP
            }
    
            benchmarks.push(benchmark);
        }
        
        await browser.close();
    
        return [true,benchmarks];
    }catch(error){
        return [false,error];
    }
}

exports.DoCPUBenchmarkScrapping = async function() {
    try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage()
        await page.setDefaultNavigationTimeout(0);
        await page.setViewport({ width: 1920, height: 1080 })
        await page.goto('https://www.tomshardware.com/reviews/cpu-hierarchy,4312.html', { waitUntil: "networkidle2" })
    
        const html = await page.content();
    
        let benchmarks = [];
    
        //let tableDiv = await page.$$('div[class="articletable"] > div')
        const result = await page.$$eval('table tr', rows => {
            return Array.from(rows, row => {
              const columns = row.querySelectorAll('td');
              return Array.from(columns, column => column.innerText);
            });
        });

        const promisesBenchmarks = [];
        promisesBenchmarks.push(processDivs1(result.slice(1,11)));
        promisesBenchmarks.push(processDivs2(result.slice(17,46)));
        return Promise.all(promisesBenchmarks)
        .then(async (results) => {
            benchmarks = benchmarks.concat(results[0], results[1]);
            await browser.close()
            return [true,benchmarks];
        })
        .catch(async (error) => {
            await browser.close()
            return [false,error];
        });
        /*
        for(var i = 1; i < 12; i++){
            // console.log(result[i][0]);
            const name = result[i][0];          //Name of the processor
            const GS1080p = result[i][1];       //Gaming Score 1080p
            const family = result[i][3];        //Processor family
            const coresThreads = result[i][4];  //Cores/Threads
            const baseBoost = result[i][5];     //Base frecuency and boost frequency
            const TDP = result[i][6];           //Power consumption
    
            const benchmark = {
                name,
                GS1080p,
                family,
                coresThreads,
                baseBoost,
                TDP
            }
    
            benchmarks.push(benchmark);
        }
        for(var i = 17; i < 46; i++){
            // console.log(result[i][0]);
            const name = result[i][0];          //Name of the processor
            const GS1080p = result[i][1];       //Gaming Score 1080p
            const family = result[i][2];        //Processor family
            const coresThreads = result[i][3];  //Cores/Threads
            const baseBoost = result[i][4];     //Base frecuency and boost frequency
            const TDP = result[i][5];           //Power consumption
    
            const benchmark = {
                name,
                GS1080p,
                family,
                coresThreads,
                baseBoost,
                TDP
            }
    
            benchmarks.push(benchmark);
        }
        */
        
    }catch(error){
        return [false,error];
    }
}

function processDivs1(divs){
    return new Promise((resolve, refuse) => {
        let benchmarks = [];
        for(benchmark of divs){//var i = 17; i < 46; i++){
            // console.log(result[i][0]);
            const name = benchmark[0];          //Name of the processor
            const GS1080p = benchmark[1];       //Gaming Score 1080p
            const family = benchmark[3];        //Processor family
            const coresThreads = benchmark[4];  //Cores/Threads
            const baseBoost = benchmark[5];     //Base frecuency and boost frequency
            const TDP = benchmark[6];           //Power consumption
    
            const res = {
                name,
                GS1080p,
                family,
                coresThreads,
                baseBoost,
                TDP
            }
    
            benchmarks.push(res);
        }
        resolve(benchmarks);
    });
}

function processDivs2(divs){
    return new Promise((resolve, refuse) => {
        let benchmarks = [];
        for(benchmark of divs){//var i = 17; i < 46; i++){
            // console.log(result[i][0]);
            const name = benchmark[0];          //Name of the processor
            const GS1080p = benchmark[1];       //Gaming Score 1080p
            const family = benchmark[2];        //Processor family
            const coresThreads = benchmark[3];  //Cores/Threads
            const baseBoost = benchmark[4];     //Base frecuency and boost frequency
            const TDP = benchmark[5];           //Power consumption
    
            const res = {
                name,
                GS1080p,
                family,
                coresThreads,
                baseBoost,
                TDP
            };
    
            benchmarks.push(res);
        }
        resolve(benchmarks);
    });
}