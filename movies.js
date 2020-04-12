'user strict';
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const superagent = require('superagent');

const app = express();
app.use(cors());

function moviesRout(request,response){
    const city = request.query.search_query;
    getMovies(city)
    .then(moviesData => response.status(200).json(moviesData));
    
  }
  

function getMovies(city){
    let moviesArray = [];
    let key = process.env.MOVIES_API_KEY;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${city}`;
  
  return superagent.get(url)
  .then((Values)=>{
    // console.log(Values,"bbbbb");
    Values.body.results.map((val)=>{
      let Values = new MOVIEs (val);
      moviesArray.push(Values);
  
    });
    return moviesArray;
  
  })
  };
  
  
  function MOVIEs(movie){
    this.title = movie.title;
    this.overview = movie.overview;
      this.average_votes = movie.average_votes;
      this.total_votes = movie.total_votes;
      this.image_url = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
    this.popularity=movie.popularity;
    this.released_on= movie.released_on;
  }
  module.exports = moviesRout;  