const request = require('request');
const cheerio = require('cheerio'); 
const filename = "./cubis.json";
const generic = require('./generic');


const url = 'https://www.restavracija-cubis.si/malice';
const name = 'Cubis'; //katerikoliFile.name
const domain = 'restavracija-cubis.si'; // nek markdownFile.domain
const selectors = {
    menu: 'div.jt_row.jt_row-fluid.row',
    dailyElement: 'div.meals',
    date: '.day',
    lunchlist: 'div.mealName',
}

// Make a request, save the html response (DOM) to $
request(url, 
    (error, response, html) => {
    
        if (error || response.statusCode != 200) {
            console.log("Error: %s\nStatusCode: %d", error, response.statusCode);
        } else {
    
            // Initialize a new JSON object to write to JSON file.
            let jsonData = generic.createJsonData(name, domain);
    
            const $ = cheerio.load(html);
            const menu = $(selectors.menu);
    
            // Scrape specific data from the website and write them to a JSON object jsonData
            generic.scrapeData($, menu, selectors, jsonData);
    
            // Write the JSON object to a file
            generic.writeToFile(filename, jsonData);
    
            console.log(generic.notify());
        }
    });
