'user strict';
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const superagent = require('superagent');

const app = express();
app.use(cors());

function weatherRout(request, response) {
    const city = request.query.search_query;
    // console.log(city, "zzzzzzzzzzz");
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
      // console.log(Data, "aaaaa");
      
    });
    return weatherSummaries;
  })
}
function Weather(day) {
  this.forecast = day.weather.description;
  this.time = new Date(day.valid_date).toString().slice(0,15);
  
  //  this.timezone = day.timezone;
}
module.exports = weatherRout;
