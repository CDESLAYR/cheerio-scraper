const request = require('request');
const cheerio = require('cheerio'); 
const filename = "./arvaj.json";
const generic = require('./generic');


const url = 'http://gostilna-arvaj.si/sl-SI/a-203054/malice';
const name = 'Arvaj';
const domain = 'gostilna-arvaj.si';
const selectors = {
    menu: 'div.col-md-4.col-md-right.cArtSorodni',
    dailyElement: 'div.cArtItem.article-item.sqwiz.text',
    date: 'abbr',
    // da prides do lunchlista mors it na <a href> pa iz une spletne strani dobit cel drug element
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

            let requestCount = 0;
    
            // Iterate over elements containing data for a specific day
            for (var i = 0; i < 5; i++) {

                var dailyData = {
                    day: '',
                    lunchlist: []
                }
        
                let lunchUrl = menu.find(selectors.dailyElement).eq(requestCount).find('a').attr('href');

                console.log(lunchUrl);

                let promiseDailyData = new Promise(function(resolve, reject) {
                    request(lunchUrl, 
                        (error, response, lunchHtml) => {
                
                            if (error || response.statusCode != 200) {
                                reject(Error("Error: %s\nStatusCode: %d", error, response.statusCode))
                
                            } else {
                
                                console.log(requestCount);
                
                                const lunchPage = cheerio.load(lunchHtml);
                
                                let dailyLunchlist = [];
                
                                // Find the appropriate element and save its text in array dailyLunchlist
                                var lunches = lunchPage('div.col-md-8.col-md-left p').eq(0).text().split("\n");
                
                                for (j = 0; j < lunches.length; j++) {
                                    dailyLunchlist.push(lunches[j]);
                                }
                
                                // Find the class .day in element and save its text in var scrapedDate
                                let date = lunchPage('article.article-detail > abbr.published').text();
                
                                // // format date to YYYY-MM-DD using moment
                                // const dateMonth = scrapedDdate.split(' ')[2];
                                // const currentYear = moment().year();
                                // const lunchMomentDate = moment(`${dateMonth}${currentYear}`, `DD.MM.YYYY`);
                                // const date = lunchMomentDate._d.toISOString();
                                
                                // Fill dailyData object for each day with date and lunchlist array 
                                dailyData.day = date;
                                dailyData.lunchlist = dailyLunchlist;
                
                                resolve(dailyData);
                            };
                        });
                });
                
                promiseDailyData.then(function(result) {
                
                    // Push that object to main JSON object jsonData
                    jsonData.data.push(result);
                
                    // Write the JSON object to a file
                    generic.writeToFile(filename, jsonData);
                
                    //move to another day (i++)
                    requestCount++;
                
                  }, function(err) {
                    console.log(err); // Error: "It broke"
                  });
            } 
            console.log(generic.notify());
    };
});
