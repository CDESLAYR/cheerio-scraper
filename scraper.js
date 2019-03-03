const request = require('request');
const cheerio = require('cheerio'); 
const fs = require('fs');
const moment = require('moment');
const filename = "./cubis.json";
const generic = require('./generic');


const url = 'https://www.restavracija-cubis.si/malice';
const name = 'Cubis'; //katerikoliFile.name
const domain = 'restavracija-cubis.si'; // nek markdownFile.domain
const selectors = {
    menu: 'div.jt_row.jt_row-fluid.row',
    dailyElement: ' > li',
    date: '.day',
    lunchlist: '.mealName > span',
    range: [1, 6]
}

// Make a request, save the html response (DOM) to cheerio
request(url, 
(error, response, html) => {

    if (error || response.statusCode != 200) {
        console.log("Error: %s\nStatusCode: %d", error, statusCode);
    } else {

        const $ = cheerio.load(html);
        const menu = $(selectors.menu);

        // Initialize a new object to write to JSON file.
        var jsonData = {
            name: name,
            domain: domain,
            data: [

            ]
        }

        // Iterate over all the DIRECT children except the first and last two (2-6)
        for (var i = 1; i < 6; i++) {

            // bit more: let dailyScrapedData = menu.find(dailyElement).eq(i);, sam ta i more bit tuki od 1-6 names 0-5
            let dailyScrapedData = menu.children().eq(i);

            // Find the class .day in element and save its text in var scrapedDate
            let scrapedDdate = dailyScrapedData.find(selectors.date).text();

            // format date to YYYY-MM-DD using moment
            const dateMonth = scrapedDdate.split(' ')[2];
            const currentYear = moment().year();
            const lunchMomentDate = moment(`${dateMonth}${currentYear}`, `DD.MM.YYYY`);
            const date = lunchMomentDate._d.toISOString();
            
            // Array of lunches available for the day
            let dailyLunchlist = [];            

            // Find the appropriate element and save its text in array dailyLunchlist
            dailyScrapedData.find(selectors.lunchlist).each((i, el) => {
                let malica = $(el).text();
                dailyLunchlist[i] = malica;
            });

            // Create an object dailyData (for every day)
            var dailyData = {
                day: date,
                lunchlist: dailyLunchlist,
            }

            // push dailyData to jsonData.data
            jsonData.data.push(dailyData);
        };

        //Write jsonData to the json file
        fs.writeFileSync(filename, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Writing to file:" + filename)
            }
        });

        console.log(generic.scrape());
    }
});
