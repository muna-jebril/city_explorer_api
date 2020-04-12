'user strict';
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const superagent = require('superagent');
const pg = require('pg');

const app = express();
app.use(cors());

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();


function locationRout(request, response) {
  
    const city = request.query.city;
    // console.log(city,"vvvv");
    getLocation(city)
    .then(locationData => response.status(200).json(locationData));
  }
  function getLocation(city) {
    let SQL = 'SELECT * FROM city WHERE search_query=$1;';
    let safeValues = [city];
    return client.query(SQL, safeValues)
  
    .then(results => {
        // console.log(results.rows.length, "bbbb");
        if (results.rows.length) {
          // console.log(results.rows,"gggggg");
          return results.rows[0];
        }
        else {
          let key = process.env.LOCATION_API_KEY;
          // console.log(key , "key");
          const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
          return superagent.get(url)
          .then(geoData => {
              // console.log(geoData.body,"ffff");
              const locationData = new Location(city, geoData.body);
              // console.log(locationData,"location");
              let search = locationData.search_query;
              let formatted_Query = locationData.formatted_query;
              let lat = locationData.latitude;
              let lon = locationData.longitude;
              // console.log(city,"bbbbmmm");
              let SQL = 'INSERT INTO city (search_query,formatted_query,latitude,longitude) VALUES($1,$2,$3,$4)';
              // console.log(SQL,"fff");
              let safeValues = [search, formatted_Query, lat, lon];
              // console.log(safeValues,"safevalues");
              return client.query(SQL, safeValues)
                .then(api=>{
                  // console.log(api.rows,"mmmmmmmmmm");
                   return locationData  ;
                })
                
            })
          }
        })
      .catch(error => errorHandler(error));
    }
    
  function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
  }
  
module.exports = locationRout;