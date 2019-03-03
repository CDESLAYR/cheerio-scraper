const request = require('request');
const cheerio = require('cheerio'); 
const fs = require('fs');
const moment = require('moment');
const filename = "./creina.json";
const generic = require('./generic');
const grammar = require('./grammar');

const name = "Creina"; //katerikoliFile.name
const domain = "hotelcreina.si"; // nek markdownFile.domain
const selectors = {
    menu: '#weekly-menu',
    dailyElement: ' > li',
    date: 'h3',
    lunchlist: 'ul > li'
}


// Make a request, save the html response (DOM) to cheerio
request('https://hotelcreina.si/restavracija/dnevna-kosila/', 
(error, response, html) => {

    if (error || response.statusCode != 200) {
        console.log("Error: %s\nStatusCode: %d", error, 1234);
    } else {

        const $ = cheerio.load(html);
        const menu = $(selectors.menu);

        // Initialize a new JSON object to write to JSON file.
        let jsonData = generic.createJsonData(name, domain);

        // Scrape specific data from the website and write them to a JSON object jsonData
        // dailyelement = ' > li', date = 'h3', lunchlist = 'ul > li'.. only specific selectors.
        generic.scrapeData($, menu, selectors.dailyElement, selectors.date, selectors.lunchlist, jsonData);

        generic.writeToFile(filename, jsonData);

        console.log(generic.scrape());
    }
});