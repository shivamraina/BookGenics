import React from 'react';
import classes from './BookDisplay.module.css';
import axios from 'axios';
import {connect} from 'react-redux';

let titleCase = (str) => {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  return splitStr.join(' '); 
};

let favourites = async (id, e) => {
  e.persist();
  try {
    await axios.post('/api/books/favorites', {id:id});
    const el = document.getElementById(e.target.id);
    if(el.className === 'far fa-heart'){
      el.className = 'fas fa-heart'
    } else {
      el.className = 'far fa-heart';
    }   
  }
  catch(ex) {
    alert(ex.response.data);
  } 
}

const bookDisplay = props => {

  let compare = (book1, book2) => {
    if(props.asc) {
      return new Date(book1.date.substring(0,10)) - new Date(book2.date.substring(0,10));
    }
    else {
      return new Date(book2.date.substring(0,10)) - new Date(book1.date.substring(0,10));
    }
  };

  let screen;
  if(props.notfound) {
    screen = <h1 className="text-center mt-5 mx-5">Sorry, No Books Found...</h1>
  }
  else {
    screen = (
      props.books.sort(compare)
      .map(book => (
              <div className='col-sm-12 col-md-6' key={book._id}>
                <div className={"card "+classes.Card}>
                  <div className="card-body">
                    <div className='row'>
                      <h5 className="card-title col-9" style={{
                          fontFamily:'verdana',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          color: 'blue'
                        }}>
                        <b>
                          {book.title}
                        </b>
                      </h5>
                      <div className="col-3 pl-4">
                        <div className="row">
                          <div className="col-6">
                            {(props.auth.isAdmin || book.uploadedBy._id === props.auth.user._id)?
                              <i className="fas fa-pencil-alt" style={{cursor: 'pointer', color:'darkGreen'}} 
                              onClick={() => props.editBookHandler(book._id)}></i>
                              :null}
                          </div>
                          <div className="col-6">
                            <i 
                            id = {book._id+"#"}
                            className = {book.liked?'fas fa-heart':'far fa-heart'}
                            style={{color:'red', cursor: 'pointer'}} 
                            onClick={(e) => favourites(book._id, e)} ></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="card-text"><b style={{color:'red'}}>Author: </b><b>{titleCase(book.author)}</b></p>
                    <p className="card-text"><b style={{color:'red'}}>Uploaded By: </b><b>{book.uploadedBy.name}</b></p>
                    <p className="card-text" style={{color:'green'}}>
                      <b style={{color:'red'}}>Genres: </b>
                      {
                        book.genres.map((genre, idx) => ( 
                        <span key={genre._id} className="mx-1"><b>{titleCase(genre.name)}{idx !== (book.genres.length-1)?',':null}</b></span> ))
                      }
                    </p>
                    <div>
                      <i className="fas fa-book-reader mx-3 mb-1" 
                        style={{cursor: 'pointer', color:'green', position: 'absolute', bottom: '0', left: '0', fontSize:'20px'}}onClick={() => props.showBookHandler(book._id)} >
                      </i>
                      <span className="card-text mx-1" style={{color:'blue', position: 'absolute', bottom: '0', right: '0'}}>
                        Uploaded On: {book.date.substring(0,10)}
                      </span>  
                    </div>
                  </div>
                </div>
              </div>))

      );
    }
    return (
      <div className='row'>
        {screen}
      </div>
    );
};  

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps)(bookDisplay);