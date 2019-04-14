const request = require('request');
const cheerio = require('cheerio'); 
const filename = "./mlecna.json";
const generic = require('./generic');
const grammar = require('./grammar.js');
const moment = require('moment');

const url = 'https://www.mlecna-restavracija.si/malice/dnevne-malice/';
const name = "Mlecna";
const domain = "mlecna-restavracija.si";
const selectors = {
    menu: 'div.text',
    dailyElement: ' > li',
    date: 'h2',
    lunchlist: 'table',
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

            // Iterate over elements containing data for a specific day
            for (var i = 0; i < 5; i++) {
        
                let date = menu.find(selectors.date).eq(i).text();
        
                // // format date to YYYY-MM-DD using moment
                // const dateMonth = scrapedDate.split(' ')[1];
                // const currentYear = moment().year();
                // const lunchMomentDate = moment(`${dateMonth}${currentYear}`, `DD.MM.YYYY`);
                // const date = lunchMomentDate._d.toISOString();
                
                // Array of lunches available for the day
                let dailyLunchlist = [];            
        
                // Find the appropriate element and save its text in array dailyLunchlist
                menu.find(selectors.lunchlist).eq(i).find('tr').slice(1).each((index, el) => {

                    // slice (0, razn zadnjega)
                    let scrapedMalica = $(el).children().slice(0, 2).text();
                    let malica = grammar.correctGrammar(scrapedMalica);
                    dailyLunchlist[index] = malica;
                });
        
                // Create an object for each day with date and lunchlist array 
                // Push that object to main JSON object jsonData
                var dailyData = {
                    day: date,
                    lunchlist: dailyLunchlist,
                }
            
                jsonData.data.push(dailyData);
            };

            // Write the JSON object to a file
            generic.writeToFile(filename, jsonData);

            console.log(generic.notify());
        };



    }
);