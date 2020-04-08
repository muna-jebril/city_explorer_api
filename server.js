'user strict';
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const pg = require('pg');



const superagent = require('superagent');


// const pg = require('pg');

const app = express();
app.use(cors());
const PORT = process.env.PORT;

const client = new pg.Client(process.env.DATABASE_URL);



app.get('/test',(request,response)=>{
  response.status(200).send('ok');
});

app.get('/city',(request,response)=>{
let SQL = 'SELECT * FROM city';
  client.query(SQL)
  .then(results=>{
    response.status(200).json(results.rows);
  })
  .catch(error => errorHandler(error));
})
app.get('/add',(request,response)=>{
let searchQquery= request.query.search_query;
let formattedQuery=request.query.formatted_query;
let lat=request.query.latitude;
let lon= request.query.longitude;
  let SQL = 'INSERT INTO city (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4)';
  let safeValues = [searchQquery, formattedQuery,lat,lon];
  
  client.query(SQL,safeValues)
  .then(results=>{
    response.status(200).json(results.rows);
  })
.catch(error=>errorHandler(error));
})

// Error Handler 
app.get('', notFoundHandler);

//let's have another function to handle any errors
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










app.get('/location', locatonHandler);
function locatonHandler(request, response) {
  const city = request.query.city;
  getLocation(city)
    .then(weatherData => response.status(200).json(weatherData));

}
function getLocation(city) {
  let key = process.env.LOCATION_API_KEY;
  const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
  return superagent.get(url)
    .then(geoData => {
      const locationData = new Location(city, geoData.body);
      return locationData;
    })

// hello 
}
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}
app.get('/weather', weatherHandler);
function weatherHandler(request, response) {
  const city = request.query.city
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
  this.forcast = day.weather.description;
  this.time = day.valid_date;
  //  this.timezone = day.timezone;
}
app.get('/trails', (request, response) => {
  const lon = request.query.lon;
  const lat = request.query.lat;
  const key = process.env.Trails_API_KEY;
  getTrails(key, lat, lon)
    .then(allTrails => response.status(200).json(allTrails));
});
function getTrails(key, lat, lon) {
  let url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=10&key=${key}`;
  return superagent.get(url)
    .then(trailData => {
      let allTrails = trailData.body.trails.map(element => {
        return new Trails(element);
      })
      return allTrails;
    });
}
function Trails(trailData) {
  this.name = trailData.name;
  this.location = trailData.location;
  this.length = trailData.length;
  this.stars = trailData.stars;
  this.summary = trailData.summary;
  this.trail_url = trailData.url;
  this.conditions = trailData.conditionDetails;
  this.condition_date = trailData.conditionDate.slice(0, 10);
  this.condition_time = trailData.conditionDate.slice(12, 19);
}







