'user strict';
// let t = 0;
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const superagent = require('superagent');
const PORT= process.env.PORT ;
const app = express();
app.use(cors());


app.get('/',(request,response)=>{
  response.send('Home Page');
});

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
app.listen(PORT, () => console.log(`App is listening on ${PORT}`));


// const server= express();

// // server.use(cors());
// server.listen(PORT,() =>{
//     console.log(`lisning on port ${PORT}`);
// })
// server.get('/',(request , response)=>{
// response.status(200).send('it works');
// })
//   server.get('/location',(req,res)=>{
//       const data = require("./data/geo.json");
//       const city = req.query.city;
//       const locationData= new Location (city,data);
//       res.send(locationData);

      
//   })
// server.get('/weather',(req,res)=>{

// const weatherData = require("./data/weather.json");
// const city = req.query.city;
// let weatherArray= [];
// for (let i = 0 ; i<weatherData.data.length; i++)
// {
//     const weather= new Weather (city,weatherData,i);
//     weatherArray.push (weather);
//     console.log(weather);
// }
// res.send(weatherArray);
// });



//   function Location (city, data){
//     this.search_query = city;
//     this.formatted_query = data[0].display_name;
//     this.latitude = data[0].lat;
//     this.longitude = data[0].lng;
//   }

// function Weather (city , weatherData,i){
//     this.search_query=city;
    
    
//     // console.log(t);
//     this.description=weatherData.data[i].weather.description;
//     this.date= weatherData.data[i].valid_date;
//     // console.log(this.data);
    
// }

//   server.use('*',(req,res)=>{
//       res.status(404).send('not fount');

//   });
  // server.use((error,req,res)=>{
  //     res.status(500).send(error);
  // })