const fs = require('fs');
const grammar = require('./grammar');

// Initialize a new JSON object to write it to file
exports.createJsonData = function(name, domain) {
    return {
        name: name,
        domain: domain,
        data: [

        ]
    }
};

exports.scrapeData = function($, menu, dailyElement, dateLocation, lunchlist, location) {

    // Iterate over DIRECT <li> children, every <li> element contains data for one day
    for (var i = selectors.range[0]; i < selectors.range[1]; i++) {

        let dailyScrapedData = menu.find(dailyElement).eq(i);

        // Find the class .day in element and save its text in var scrapedDate
        let date = dailyScrapedData.find(dateLocation).text();

        // // format date to YYYY-MM-DD using moment
        // const dateMonth = scrapedDdate.split(' ')[2];
        // const currentYear = moment().year();
        // const lunchMomentDate = moment(`${dateMonth}${currentYear}`, `DD.MM.YYYY`);
        // const date = lunchMomentDate._d.toISOString();
        
        // Array of lunches available for the day
        let dailyLunchlist = [];            

        // Find the appropriate element and save its text in array dailyLunchlist
        dailyScrapedData.find(lunchlist).each((i, el) => {
            let scrapedMalica = $(el).children().text();
            let malica = grammar.correctGrammar(scrapedMalica);
            dailyLunchlist[i] = malica;
        });

        // Create an object for each day with date and lunchlist array 
        // Push that object to main JSON object jsonData
        var dailyData = {
            day: date,
            lunchlist: dailyLunchlist,
        }
    
        location.data.push(dailyData);
    };
};

// Write the JSON object to a file
exports.writeToFile = function(filename, jsonData) {
    fs.writeFileSync(filename, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Writing to file:" + filename)
        }
    });
};

exports.scrape =  function(){
    return "Scrape that shit";
};