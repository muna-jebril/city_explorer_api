'user strict';
const express = require('express');

const cors = require('cors');

require('dotenv').config();

const superagent = require('superagent');

// const pg = require('pg');

const PORT= process.env.PORT || 3000;
const app = express();

app.use(cors());

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
})



app.get('/location',locatonHandler);



function locatonHandler(request,response){
  const city = request.query.city;
  getLocation(city)
  .then (weatherData => response.status(200).json(weatherData));
  
}
function getLocation(city){
  let key = process.env.LOCATION_API_KEY;
  const url= `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
  return superagent.get(url)
  .then(geoData =>{
    const locationData = new Location (city , geoData.body);
    return locationData;
  })
  
  
}
function Location (city,geoData){
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}
app.get('/weather',weatherHandler );
function weatherHandler(request,response){
  const city = request.query.city
  console.log(city,"zzzzzzzzzzz");
  getWeather(city)
  .then (Data => response.status(200).json(Data));
  
}


function getWeather(city){
  const weatherSummaries = [];
    let key = process.env.WEATHER_API_KEY;
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;
    return superagent.get(url)
    .then(Data=>{
      
      Data.body.data.map(val=> {
        var Data = new Weather(val);
        weatherSummaries.push(Data);
        console.log(Data,"aaaaa");
        
      });
      return weatherSummaries;
    })
  }
  function Weather (day){
    this.forcast= day.weather.description;
    this.time = day.valid_date;
    //  this.timezone = day.timezone;
  }
  
  
  
  app.get('/trails',(request,response) =>{
    const lon = request.query.lon;
    const lat = request.query.lat;
    const key = process.env.Trails_API_KEY;
  
    getTrails(key,lat,lon)
      .then(allTrails => response.status(200).json(allTrails));
  
  
  });
  
  
  
  
  
  function getTrails(key,lat,lon){
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
    this.summary= trailData.summary;
    this.trail_url= trailData.url;
    this.conditions= trailData.conditionDetails;
    this.condition_date= trailData.conditionDate.slice(0,10);
    this.condition_time=trailData.conditionDate.slice(12,19);
  }
  
  app.get('/', (request, response) => {
    response.status(200).send('Welcome 301d4,it works');
  });
  
  app.use('*', (request, response) => {
    response.status(404).send('NOT FOUND');
  });
  
  
  app.use((error, request, response) => {
    response.status(500).send({'Status': 500,responseText:'sorry something went wrong'});
  });