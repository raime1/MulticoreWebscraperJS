const puppeteer = require('puppeteer')

exports.DoGPUBenchmarkScrappingST = async function() {
    try{
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.setDefaultNavigationTimeout(0);
        await page.setViewport({ width: 1920, height: 1080 })
        await page.goto('https://www.tomshardware.com/reviews/gpu-hierarchy,4388.html', { waitUntil: "networkidle2" })
    
        const html = await page.content();
    
        const benchmarks = [];
    
        //let tableDiv = await page.$$('div[class="articletable"] > div')
        const result = await page.$$eval('table tr', rows => {
            return Array.from(rows, row => {
              const columns = row.querySelectorAll('td');
              return Array.from(columns, column => column.innerText);
            });
        });
        
        for(var i = 1; i < 52; i++){
            // console.log(result[i][0]);
            const name = result[i][0];          //Name of the GPU
            const score = result[i][1];         //Score
            const family = result[i][2];        //GPU family
            const baseBoost = result[i][3];     //Base frecuency and boost frequency
            const memory = result[i][4];        //Memory     
            const power = result[i][5];         //Power consumption
    
            const benchmark = {
                name,
                score,
                family,
                baseBoost,
                memory,
                power
            }
    
            benchmarks.push(benchmark);
        }
        
        await browser.close()
    
        return [true,benchmarks];
    }catch(error){
        return [false,error];
    }
}

exports.DoGPUBenchmarkScrapping = async function() {
    try{
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.setDefaultNavigationTimeout(0);
        await page.setViewport({ width: 1920, height: 1080 })
        await page.goto('https://www.tomshardware.com/reviews/gpu-hierarchy,4388.html', { waitUntil: "networkidle2" })
    
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
        promisesBenchmarks.push(processDivs(result.slice(1,25)));
        promisesBenchmarks.push(processDivs(result.slice(26,51)));
        return Promise.all(promisesBenchmarks)
        .then(async (results) => {
            benchmarks = benchmarks.concat(results[0], results[1]);
            await browser.close();
            return [true,benchmarks];
        })
        .catch(async (error) => {
            await browser.close();
            return [false,error];
        });
        /*
        for(var i = 1; i < 52; i++){
            // console.log(result[i][0]);
            const name = result[i][0];          //Name of the GPU
            const score = result[i][1];         //Score
            const family = result[i][2];        //GPU family
            const baseBoost = result[i][3];     //Base frecuency and boost frequency
            const memory = result[i][4];        //Memory     
            const power = result[i][5];         //Power consumption
    
            const benchmark = {
                name,
                score,
                family,
                baseBoost,
                memory,
                power
            }
    
            benchmarks.push(benchmark);
        }
        */
    }catch(error){
        return [false,error];
    }
}

function processDivs(divs){
    return new Promise((resolve, refuse) => {
        let benchmarks = [];
        for(benchmark of divs){//var i = 17; i < 46; i++){
            // console.log(result[i][0]);
            const name = benchmark[0];          //Name of the GPU
            const score = benchmark[1];         //Score
            const family = benchmark[2];        //GPU family
            const baseBoost = benchmark[3];     //Base frecuency and boost frequency
            const memory = benchmark[4];        //Memory     
            const power = benchmark[5];         //Power consumption
    
            const res = {
                name,
                score,
                family,
                baseBoost,
                memory,
                power
            }
    
            benchmarks.push(res);
        }
        resolve(benchmarks);
    });
}