'user strict';
let t = 0;
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const PORT= process.env.PORT || 3000;
const server= express();
server.use(cors());
server.listen(PORT,() =>{
    console.log(`lisning on port ${PORT}`);
})
server.get('/',(request , response)=>{
response.status(200).send('it works');
})
  server.get('/location',(req,res)=>{
      const data = require("./data/geo.json");
      const city = req.query.city;
      const locationData= new Location (city,data);
      res.send(locationData);

      
  })
server.get('/weather',(req,res)=>{

const weatherData = require("./data/weather.json");
const city = req.query.city;
let weatherArray= [];
for (let i = 0 ; i<weatherData.data.length; i++)
{
    const weather= new Weather (city,weatherData,i);
    weatherArray.push (weather);
    console.log(weather);
}
res.send(weatherArray);
});



  function Location (city, data){
    this.search_query = city;
    this.formatted_query = data.display_name;
    this.latitude = data.lat;
    this.longitude = data.lng;
  }

function Weather (city , weatherData,i){
    this.search_query=city;
    
    
    // console.log(t);
    this.description=weatherData.data[i].weather.description;
    this.date= weatherData.data[i].valid_date;
    // console.log(this.data);
    
}

  server.use('*',(req,res)=>{
      res.status(404).send('not fount');

  });
  server.use((error,req,res)=>{
      res.status(500).send(error);
  })