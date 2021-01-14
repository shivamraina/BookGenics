const express = require('express');
// const Fawn = require('fawn');
const router = express.Router();
const auth = require('../../middleware/auth');
const { Book } = require('../../models/book');
const { User } = require('../../models/user');
const { Genre } = require('../../models/genre');
const validateBookInput = require('../../validation/validateBookInput'); 
const { mongo } = require('mongoose');

// Fawn.init(mongo);

function getLikedStatus(books, userFavorites,choice) {
  let ret = [];
  for(book of books) {
    ret.push(book.toJSON());
  }
  if(choice){
    for(book of ret) {
      book.liked = true;
    }
    return ret;
  }

  const likedBooks={}
  for(favs of userFavorites){
    likedBooks[favs._id.toString()]=1
  }
  for(book of ret) {
    if (likedBooks[book._id.toString()]) book.liked = true;
    else book.liked = false;
  }
  return ret;
}

router.get('/', auth, async (req,res) => {
  try {
    const id = req.user._id;
    const userGenres = await User.findById(id).select({genresPreferred:1,_id:0});
    const user = await User.findById(id);
    const books = await Book.find({
      genres: { $in: userGenres.genresPreferred}
    }).sort('title').limit(200).populate('uploadedBy','name _id');

    let ret = getLikedStatus(books, user.favorites,0);
    res.send(ret);
  }
  catch(ex) {
    res.send(ex);
  }
});

router.get('/favorites/me', auth, async(req, res) => {
  try {
    const id = req.user._id;
    let books = [];

    const user = await User.findById(id);
    for(favs of user.favorites) {
      let currbook = await Book.findById(favs._id).populate('uploadedBy', 'name _id');
      if(currbook) books.push(currbook);
    }
    let ret = getLikedStatus(books, user.favorites,1);
    res.send(ret);
  }
  catch(ex) {
    res.send(ex);
  }
});

router.get('/added/me', auth, async(req, res) => {
  try {
    const id = req.user._id;
    
    /* for full filtered */
    // let books = (await Book.find().sort('title').populate('uploadedBy', 'name _id'))
    // .filter(book => {
    //   console.log(book);
    //   return book.uploadedBy._id.toString() === id.toString()
    // });
    // const upperLimit = Math.min(books.length, 201);
    // if(books) books = books.slice(0, upperLimit);
    // let ret = getLikedStatus(books, (await User.findById(req.user._id)).favorites,0);
    // res.send(ret);

    /* for full */
    let books = await Book.find().populate('uploadedBy', 'name _id');
    books = books.filter(book => book.uploadedBy._id.toString() === id.toString());
    const upperLimit = Math.min(books.length, 201);
    if(books) books = books.slice(0, upperLimit);
    // books.sort((a, b) => ''+a.title.localeCompare(b.title));
    let ret = getLikedStatus(books, (await User.findById(req.user._id)).favorites,0);
    res.send(ret);
  }
  catch(ex) {
    res.send(ex);
  }
});

router.post('/favorites', auth, async (req,res) => {
  try {
    const id = req.user._id;
    const user = await User.find({_id: id});

    let found = false; 
    for(favs of user[0].favorites) {
      if(favs._id.toString() === req.body.id) {
        found = true;
        break;
      }
    }

    if(!found){
      const book = await Book.find({_id:req.body.id});
      await User.findByIdAndUpdate(id, { $push: { favorites: book[0] } } );
    }
    else {
      const book = await Book.find({_id:req.body.id});
      await User.findByIdAndUpdate(id, { $pull: { favorites: book[0]} } );
    }
    res.send('OK');
  }
  catch(ex) {
    res.send(ex);
  }
});

router.post('/filter/:id', auth, async (req,res) => {
  try {
    if(req.params.id > 3) return res.status(400).send('Invalid Request');
    const criteria={}
    if(req.body.filterName && req.body.filterName.length) criteria.title = {$regex:new RegExp(req.body.filterName, "i")};
    if(req.body.filterAuthor && req.body.filterAuthor.length) criteria.author = {$regex:new RegExp(req.body.filterAuthor, "i")};
    
    if(req.body.filterUploader && req.body.filterUploader.length){
      const users = await User.find({name: {$regex:new RegExp(req.body.filterUploader, "i")} })
      criteria.uploadedBy = { $in: users};
    }

    for(genre of req.body.filterGenres) {
      genre.__v = 0;
    }

    if(req.body.filterGenres && req.body.filterGenres.length) {
      criteria.genres = { $in: req.body.filterGenres};
    }

    let books = [];
    if(req.params.id === '1') {
      if(Object.keys(criteria).length === 0 && criteria.constructor === Object) {
        const userGenres = await User.findById(req.user._id).select({genresPreferred:1,_id:0});
        books = await Book.find({
          genres: { $in: userGenres.genresPreferred}
        }).sort('title').limit(200).populate('uploadedBy','name _id');
      }
      else {
        books = await Book.find(criteria).sort('title').limit(200).populate('uploadedBy','name _id').select('-content');
      }
    }

    else if(req.params.id === '2') {
      books = (await Book.find(criteria).sort('title').limit(200).populate('uploadedBy', 'name _id')).filter(book => book.uploadedBy._id.toString() === req.user._id.toString());
      const upperLimit = Math.min(books.length, 201);
      if(books) books = books.slice(0, upperLimit);
    }
    else {
      const user = await User.findById(req.user._id);
      for(favs of user.favorites) {
        criteria._id = favs._id;
        let currbook = await Book.find(criteria).sort('title').populate('uploadedBy', 'name _id');
        if(currbook.length>0) books.push(currbook[0]);
      }
    }
    if(!books) return res.send([]); 
    let ret = getLikedStatus(books, (await User.findById(req.user._id)).favorites);
    res.send(ret);
  }
  catch(ex) {
    res.send(ex);
  }
});

router.get('/:id', auth, async (req,res) => {
  
  const id = req.params.id;
  //If invalid id pattern return 404
  if (! id.match(/^[0-9a-fA-F]{24}$/)) return res.status(404).send("The id is invalid!");
  
  try {
    //look book if no book return 404 resource not found
    let book = await Book.findById(id).populate('uploadedBy');
    if(!book) return res.status(404).send("The Book with the given id is not found!");
    res.send(book);
  }
  catch(ex) {
    res.send(ex);
  }

});

router.post('/', auth, async (req,res) => {

  try {

    let Genres = [];
    for(gen of req.body.genres) {
      const Gen = await Genre.find({name: gen});
      if(Gen.length>0) Genres.push(Gen[0]);
    }
    req.body.genres = Genres;

    const { error } = validateBookInput(req.body);
    if(error) {
      // console.log(req.body);
      // console.log(error.details[0].message)
      // const idk= req.body.genres[0];
      // const mt = idk._id;
      // console.log(idk);
      // console.log(typeof mt);
      // const id = req.user._id;
      // console.log(typeof id);
      return res.status(400).send(error.details[0].message);
    }

    const id = req.user._id;
    let book = new Book({
        title: req.body.title,
        author: req.body.author,
        content : req.body.content,
        genres : req.body.genres,
        uploadedBy: id
    });

    await book.save();
    await book.populate('uploadedBy').execPopulate();
    res.send('OK');
  }
  catch(ex){
    res.send(ex);
  }

});

router.put('/:id', auth, async (req,res) => {
    const id = req.params.id;
    
    if (! id.match(/^[0-9a-fA-F]{24}$/)) return res.status(404).send("The id is invalid!");

    try {
      //look book if no book return 404 resource not found
      let book = await Book.findById(id);
      if(!book) return res.status(404).send("The Book with the given id is not found!");

      // Check if user is authorized to perform task-
      const userid = req.user._id;
      if(!req.user.isAdmin && userid.toString() !== book.uploadedBy.toString()) return res.status(403).send('Access Denied');

      // otherwise validate body; if invalid return 400 bad request
      if(req.body.newTitle.trim().length<3 || req.body.newAuthor.trim().length < 3) {
        return res.status(400).send('Values should be atleast 4 characters long');
      }

      //next everything good update course and return updated course
      // First query and then Update (query has been done above)
      // new Fawn.Task()
      //   .updateMany('users',{ favorites: book}, { $set: { "favorites.$.title": req.body.newTitle,"favorites.$.author": req.body.newAuthor } }).exec()
      //   .update('books',{_id: id},{$set: { title: req.body.newTitle, author: req.body.newAuthor} })
      //   .run();
      await User.updateMany({ favorites: book}, { $set: { "favorites.$.title": req.body.newTitle,"favorites.$.author": req.body.newAuthor } }).exec();
      book.set({
          title: req.body.newTitle,
          author: req.body.newAuthor
      });

      // If the book has passed Joi test we'll still test Database Level
      await book.save();
      res.send('OK'); //actual book JSON object
    }
    catch(ex){
      res.send(ex);
    }
});

router.delete('/:id',auth,async (req,res)=>{
    
  const id = req.params.id;  
  //If invalid id pattern return 404
  if (! id.match(/^[0-9a-fA-F]{24}$/)) return res.status(404).send("The id is invalid!");

  try {
    //look book if no book return 404 resource not found
    let book = await Book.findById(id);
    if(!book) return res.status(404).send("The Book with the given id is not found!");

    // Check if user is authorized to perform task-
    const userid = req.user._id;
    if(!req.user.isAdmin && userid.toString() != book.uploadedBy.toString()) return res.status(403).send('Access Denied');

    await User.updateMany({}, { $pull: { favorites: book} } ).exec();
    await Book.deleteOne({_id: id });
    res.send('OK');
  }
  catch(ex) {
    res.send(ex);
  }
});
module.exports = router;