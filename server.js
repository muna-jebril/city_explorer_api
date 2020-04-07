'user strict';
const express = require('express');

const cors = require('cors');

require('dotenv').config();

const superagent = require('superagent');

const pg = require('pg');

const PORT= process.env.PORT || 3000;
const app = express();

app.use(cors());


const client = new pg.Client(process.env.DATABASE_URL);


client.connect()
  .then(()=>{
    app.listen(PORT, () => {
      console.log(`Listening on PORT ${PORT}`);
    });
  })

// Routes 
app.get('/locations',(request,response)=>{
  let SQL = 'SELECT * FROM city';
  client.query(SQL)
  .then(results =>{
      response.status(200).json(results.rows);
  })
  .catch (error => errorHandler(error));
})
app.get('/add',(request,response)=>{
  let formatted_query = request.query.formatted_query;
  let lat = request.query.lat;
  let lon = request.query.lon;
  let search_query = request.query.search_query;
  
  let safeValues= [ formatted_query,lat,lon,search_query];
  let SQL = 'INSERT INTO city ( formatted_query VARCHAR(255),lat float,lon float,search_query VARCHAR(255)) VALUES ($1,$2)';
  client.query(SQL,safeValues)
  .then( results => {
      response.status(200).json(results.rows);
  })


  .catch (error => errorHandler(error));

})

app.get('/',(request,response)=>{
  response.send('Home Page');
});

// Error Handler
app.get('*', notFoundHandler);

//let's have another function to handle any errors
app.use(errorHandler);

function notFoundHandler(request,response) { 
    response.status(404).send('huh????');
}

function errorHandler(error, request, response) {
    response.status(500).send(error);
}



app.get('/weather',weatherHandler );
app.get('/location',locatonHandler);



function weatherHandler(request,response){
  const city = request.query.city
  console.log(city,"zzzzzzzzzzz");
  getWeather(city)
  .then (Data => response.status(200).json(Data));
  
}
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
  // app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
  
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
    // app.get('/trails',trailsHandler);
    
    //  function trailsHandler(request,response){
    //   const lat = request.query.latitude;
    //   const lon = request.query.longitude
    
    
    //    getTrails(lat , lon )
    //    .then(trailsData=>response.status(200).json(trailsData));
    //  }
     
    //  function getTrails(lat ,lon){
    //    const trailsSum=[];
    //    let key = process.env.Trails_API_KEY;
    
    //    const url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=100&sort=Distance&key=${key}`;
    //  return superagent.get(url)
    //  .then(Data2=>{
    //    Data2.body.trails.map(val=>{
    //      let Data2= new Trails(Data2);
    // trailsSum.push(Data2);
    
    //    });
    //    return trailsSum;
    //  })
    //   }
    
    // function Trails (Data2){
    //   this.name = trailData.name;
    //   this.location = trailData.location;
    //   this.length = trailData.length;
    //   this.stars = trailData.stars;
    //   this.summary= trailData.summary;
    //   this.trail_url= trailData.url;
    //   this.conditions= trailData.conditionDetails;
    //   this.condition_date= trailData.conditionDate;
      
    // }
  // })