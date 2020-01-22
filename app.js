// require local depencies
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const movies = require('./movie.js');

const app = express();
app.use(morgan('dev'));
app.use(cors());

app.get('/movie', (req, res) => {
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
  if(!filteredMovies.find(each=>each.country.includes(country))){
    
     return res.status(400).json({error:"Country not found"})
  }
return res.status(200).send(`Found ${country}`)
}

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
});

app.listen(8001, () => {
  console.log('listening on port 8001');
});