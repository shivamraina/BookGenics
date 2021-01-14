const express = require('express');
const { Genre } = require('../../models/genre');
const router = express.Router();
const { OTHERS } = require('../../utils/genreNames');

router.get('/', async (req, res) => {
  try {
    const genres = await Genre.find().select('name').sort('name');
    let index = 0;
    for(let idx in genres) {
      if(genres[idx].name === OTHERS) {
        index = idx;
        break;
      }
    }
    const temp = genres[index];
    genres.splice(index, 1);
    genres.push(temp);
    res.send(genres);
  }
  catch(ex) {
    res.send(ex);
  }
});


module.exports = router;