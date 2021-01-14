import React from 'react';

const fullBookDisplay = props => {

  let screen;
  if(!props.showingBook) screen = null;
  
  else if(props.show) {
    screen = (
      <div>
        <h5><b>Title: {props.showingBook.title}</b></h5>
        <h5><b>Author: {props.showingBook.author}</b></h5>
        <h5><b>Story:</b></h5>
        <div style={{height:'500px', overflow: 'scroll'}}>
          <span style={{fontFamily:'verdana'}}>{props.showingBook.content}</span>
        </div>
      </div>
    );
  }

  else {
    screen = (
      <div>
        <h1 className="text-center">Edit Book Data:</h1>
        <form>
          <div className="form-group">
            <label htmlFor="newTitle">Change Title</label>
            <input type="text" className="form-control" id="newTitle" onChange={props.onChange} defaultValue={props.showingBook.title} />
          </div>
          <div className="form-group">
            <label htmlFor="newAuthor">Change Author</label>
            <input type="text" className="form-control" id="newAuthor" onChange={props.onChange} defaultValue={props.showingBook.author} />
          </div>
          <button type="submit" className="btn btn-primary" onClick={() => props.changeBook(props.showingBook._id)}>Submit</button>
          <div className="d-flex flex-row-reverse">
            <button type="submit" className="flex-row-reverse btn btn-danger align-right" onClick={() => props.deleteBook(props.showingBook._id)}>DELETE BOOK</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      {screen}
    </div>
  );
};

export default fullBookDisplay;