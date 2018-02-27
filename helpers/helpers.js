const request = require('request');
const config = require('../config.js');

// Yelp API option
const yelpSearch = (loc, keyword) => {
  // categories based on https://www.yelp.com/developers/documentation/v3/all_category_list
  // Find non food related businesses
  return new Promise((resolve, reject) => {
    const YELP_CATEGORIES = `active,arts,auto,beautysvc,bicycles,education,
                        health,homeservices,hotelstravel,localservices,
                        nightlife,pets,professional,realestate,religiousorgs,
                        shopping`;

    const options = {
      url: 'https://api.yelp.com/v3/businesses/search',
      headers: {
        Authorization: `Bearer ${config.yelpKey}`
      },
      qs: {
        location: loc,
        radius: 24000, // in meters, about 15 miles
        categories: YELP_CATEGORIES
      }
    };

    if (keyword !== '') {
      options.qs.term = keyword;
    }

    request(options, (err, res, body) => {
      if (err) {
        console.log(`Unable to get yelp API data: ${err}`);
        reject(err);
      } else {
        console.log('Successfully queried Yelp API');
        resolve(JSON.parse(body));
      }
    });
  });
};

const yelpSearchDetails = (id) => {
  return new Promise((resolve, reject) => {
    const options = {
      url: `https://api.yelp.com/v3/businesses/${id}`,
      headers: {
        Authorization: `Bearer ${config.yelpKey}`
      }
    };

    request(options, (err, res, body) => {
      if (err) {
        console.log(`Unable to get yelp detailed business data: ${err}`);
        reject(err);
      } else {
        // Used to format yelp API's hour result to human readable format
        const NUM_DAY_TO_ACTUAL = {
          0: 'Monday',
          1: 'Tuesday',
          2: 'Wednesday',
          3: 'Thursday',
          4: 'Friday',
          5: 'Saturday',
          6: 'Sunday'
        };

        const data = JSON.parse(body);
        const storeData = {};
        const allHours = data.hours[0].open;
        storeData.hours = [];
        allHours.forEach((storeHour) => {
          const day = NUM_DAY_TO_ACTUAL[storeHour.day];
          storeData.hours.push(`${day}: ${storeHour.start} - ${storeHour.end}`);
        });
        storeData.photos = data.photos;
        resolve(storeData);
      }
    });
  });
};

exports.yelpSearch = yelpSearch;
exports.yelpSearchDetails = yelpSearchDetails;
