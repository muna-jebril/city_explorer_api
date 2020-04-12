const express = require('express');
const cors = require('cors');
require('dotenv').config();
const superagent = require('superagent');
const app = express();
app.use(cors());

function yelpRout(request,response)
{
  const city=request.query.search_query;
 getyelp(city)
 
    .then(yelpData =>response.status(200).json(yelpData));
}

function getyelp(city)
{
  let key=process.env.YELP_API_KEY;
// console.log(resturant,"zzzzzzzzzzzz");
let url = `https://api.yelp.com/v3/businesses/search?location=${city}`;
return superagent.get(url)
  .set('Authorization', `Bearer ${key}`)
  .then( yelpData => {
    console.log(yelpData.body.businesses);
    return yelpData.body.businesses.map( (val) => {
      return new YELP(val);


    });
  })
}

function YELP(yelpData){
    this.name= yelpData.name;
    this.image_url= yelpData.image_url;
    this.price= yelpData.price;
    this.rating= yelpData.rating;
  this.url= yelpData.url;
  }
  module.exports = yelpRout; 