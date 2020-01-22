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
  const genreList = ['Grotesque', 'Animation', 'Drama', 'Romantic', 'Comedy', 'Spy', 'Crime', 'Thriller', 'Adventure', 'Documentary', 'Horror', 'Action', 'Musical', 'Biography'];
  // genre
  if(genre) {
    // if genre doesn't exist, return error code
    if(!genreList.includes(genre)) {
      return res.status(400).json({error: 'Genre must be one of the following: ......'});
    }
    // since each movie only has 1 genre, filter for specified genre
    filteredMovies = filteredMovies.filter(movie => movie.genre === genre);
  }

  // country
  // avg_vote
  
  res.json(filteredMovies);
});

app.listen(8001, () => {
  console.log('listening on port 8001');
});