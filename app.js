// require local depencies
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
// load data
const movies = require('./movie.js');

// invoke express to create object with express methods
const app = express();

// configure middleware
app.use(morgan('common'));
app.use(helmet());
app.use(cors());
app.use(handleAuth);

// middleware
function handleAuth(req, res, next) {
  // if authorization not provided, insert empty string
  const bearToken = req.get('Authorization') || '';
  // get stored token
  const apiToken = process.env.API_TOKEN;
  // if token does not match, return error code
  if(apiToken !== bearToken.split(' ')[1]) {
    return res.status(401).json({ error: 'Unauthorized request'});
  }
  // else move on to callback
  next();
}

// callback
function handleMovieFilter(req, res) {
  const {genre, country, avg_vote} = req.query;
  let filteredMovies = [ ...movies ];
  // genre
  if(genre) {
    // if genre doesn't exist, return error code
    if(!filteredMovies.find(movie => movie['genre'].toLowerCase() === genre.toLowerCase())) {
      return res.status(400).json({error: 'Genre not found.'});
    }
    // since each movie only has 1 genre, filter for specified genre
    filteredMovies = filteredMovies.filter(movie => movie['genre'].toLowerCase() === genre.toLowerCase());
  }

  // country
  if(country){
    // if country doesn't exist, return error code
    if(!filteredMovies.find(each=>each['country'].toLowerCase().includes(country.toLowerCase()))){
      return res.status(400).json({error:'Country not found'});
    }
    // filter for country
    filteredMovies = filteredMovies.filter(movie => movie['country'].toLowerCase().includes(country.toLowerCase()));
  }
  

  // avg_vote
  if(avg_vote){
    // if avg vote is invalid, return error code
    if(isNaN(avg_vote)) {
      return res.status(400).json({error: 'Average vote has to be a number.'});
    }
    if(avg_vote<0 || avg_vote>10) {
      return res.status(400).json({error: 'Average vote has to be between 0-10.'});
    }
    // filter movie for avg vote >= the specified vote
    filteredMovies = filteredMovies.filter(movie => movie['avg_vote'] >= Number(avg_vote));
  }
  res.json(filteredMovies);
}

app.get('/movie', handleMovieFilter);

app.listen(8001, () => {
  console.log('listening on port 8001');
});