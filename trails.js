const express = require('express');
const cors = require('cors');
require('dotenv').config();
const superagent = require('superagent');
const app = express();
app.use(cors());

function trailsRout(request, response) {
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
        // console.log
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
  module.exports = trailsRout;