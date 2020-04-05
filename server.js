'user strict';
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

  function Location (city, data){
    this.search_query = city;
    this.formatted_query = data[0].display_name;
    this.latitude = data[0].lat;
    this.longitude = data[0].lng;
  }
  server.use('*',(req,res)=>{
      res.status(404).send('not fount');

  });
  server.use((error,req,res)=>{
      res.status(500).send(error);
  })