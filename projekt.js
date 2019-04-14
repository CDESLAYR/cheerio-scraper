const filename = "./cubis.json";
const generic = require('./generic');
const domain = "projektburger.si";


            // Initialize a new JSON object to write to JSON file.
            let jsonData = generic.createJsonData(filename, domain);

            // Iterate over elements containing data for a specific day
            for (var i = 0; i < 5; i++) {
        
                let date = new Date();

                console.log(date);
        
                /* format date to YYYY-MM-DD using moment
                const dateMonth = grammarDate.split(' ')[1];
                const currentYear = moment().year();
                const lunchMomentDate = moment(`${dateMonth}${currentYear}`, `DD.MM.YYYY`);
                const idate = lunchMomentDate._d.toISOString();

                */
                
                // Array of lunches available for the day
                let dailyLunchlist = [
                    "LORD: domač Brioche bun, slovenska govedina, sir Cheddar, hrustljava slanina, hišna BBQ omaka, paradižnik Lušt, rdeča čebula, krompirček - 6,20€ ",
                    "CHEEZ: domač Brioche bun, slovenska govedina, sir Cheddar, hišna BBQ omaka, solata ledenka, paradižnik Lušt, bela čebula, krompirček - 5,70€ ",
                    "CHICKY: domač Brioche bun, curry piščanec z žara, majonezna omaka, solata ledenka, paradižnik Lušt, krompirček - 5,30€ ",
                    "BASTARDO: domač Brioche bun, slovenska govedina, sir Cheddar, hrustljava slanina, Chilly mayo jalapeno salsa, kisla čebula - 6,80€ ",
                    "MUSTARDO: domač Brioche bun, slovenska govedina, sir Cheddar, gorčica, Sriracha, majonezna omaka, bela in rdeča čebula, krompirček - 5,70€ ",
                    "SENDVIČ Vegi: domač Brioche bun, slovenska govedina, sir Cheddar, hrustljava slanina, hišna BBQ omaka, paradižnik Lušt, rdeča čebula, krompirček - 4,20€ ",
                    "SENDVIČ BLT: slanina, ledenka, paradižnik Lušt - 4,20€ ",
                    "SENDVIČ Bacon&Egg roll: slanina & jajce - 4,20€ "
                ];            
        
                // Create an object for each day with date and lunchlist array 
                // Push that object to main JSON object jsonData
                var dailyData = {
                    day: date,
                    lunchlist: dailyLunchlist,
                }
            
                jsonData.data.push(dailyData);
            };

            // Write to file
            fs.writeFileSync(filename, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Writing to file:" + filename)
                }
            });
        
            // Notify
            console.log("Scrape that shit");