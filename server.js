'user strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT;
app.use(cors());

const client = new pg.Client(process.env.DATABASE_URL);


// lab8 


app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/trails',trailsHandler);

function locationHandler(request, response) {
  
  const city = request.query.city;
  console.log(city,"vvvv");
  getLocation(city)
  .then(locationData => response.status(200).json(locationData));
}
function getLocation(city) {
  let SQL = 'SELECT * FROM city WHERE search_query=$1;';
  let safeValues = [city];
  return client.query(SQL, safeValues)

  .then(results => {
      console.log(results.rows.length, "bbbb");
      if (results.rows.length) {
        console.log(results.rows,"gggggg");
        return results.rows[0];
      }
      else {
        let key = process.env.LOCATION_API_KEY;
        console.log(key , "key");
        const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
        return superagent.get(url)
        .then(geoData => {
            console.log(geoData.body,"ffff");
            const locationData = new Location(city, geoData.body);
            console.log(locationData,"location");
            let search = locationData.search_query;
            let formatted_Query = locationData.formatted_query;
            let lat = locationData.latitude;
            let lon = locationData.longitude;
            console.log(city,"bbbbmmm");
            let SQL = 'INSERT INTO city (search_query,formatted_query,latitude,longitude) VALUES($1,$2,$3,$4)';
            console.log(SQL,"fff");
            let safeValues = [search, formatted_Query, lat, lon];
            console.log(safeValues,"safevalues");
            return client.query(SQL, safeValues)
              .then(api=>{
                console.log(api.rows,"mmmmmmmmmm");
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














function weatherHandler(request, response) {
  const city = request.query.search_query;
    console.log(city, "zzzzzzzzzzz");
    getWeather(city)
    .then(Data => response.status(200).json(Data));
    
  }
  function getWeather(city) {
    const weatherSummaries = [];
  let key = process.env.WEATHER_API_KEY;
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;
  return superagent.get(url)
  .then(Data => {
    Data.body.data.map(val => {
      var Data = new Weather(val);
      weatherSummaries.push(Data);
      console.log(Data, "aaaaa");
      
    });
    return weatherSummaries;
  })
}
function Weather(day) {
  this.forecast = day.weather.description;
  this.time = new Date(day.valid_date).toString().slice(0,15);
  
  //  this.timezone = day.timezone;
}
function trailsHandler(request, response) {
  let lat = request.query.latitude;
  let lon = request.query.longitude;
  getTrails(lat, lon)
    .then(trailsData => {
      response.status(200).json(trailsData);
    })
  }
  let trailsDataarr = [];
  function getTrails(lat, lon) {
    
  let key = process.env.TRAILS_API_KEY;
  const url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=200&key=${key}`;
  return superagent.get(url)
    .then(trailsData => {
      console.log
      trailsData.body.trails.map(val => {

        trailsDataarr.push( new Trail(val));
        

      });
      return trailsDataarr;
    });
  }

  function Trail(val) {
    this.id = val.id;
    this.name = val.name;
  this.location = val.location;
  this.length = val.length;
  this.stars = val.stars;
  this.star_votes = val.starVotes;
  this.summary = val.summary;
  this.trail_url = val.url;
  this.conditions = val.conditionStatus;
  this.condition_date = val.conditionDate.substring(0, 11);
  this.condition_time = val.conditionDate.substring(11);
  
}

app.get('', notFoundHandler);

app.use(errorHandler);

function notFoundHandler(request,response) { 
  response.status(404).send('huh????');
}

function errorHandler(error, request, response) {
  response.status(500).send(error);
}





client.connect()
.then(()=>{
  app.listen(PORT, () =>
  console.log(`listening on ${PORT}`)
  );
})

        // app.get('/', (request, response) => {
        //   response.send('WELCOME TO THE HOME PAGE! ');
        // })