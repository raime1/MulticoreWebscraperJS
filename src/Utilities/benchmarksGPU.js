const puppeteer = require('puppeteer')

exports.DoGPUBenchmarkScrapping = async function() {
    try{
        benchmarks
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