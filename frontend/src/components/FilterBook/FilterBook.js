import React from 'react';
import { Multiselect } from 'multiselect-react-dropdown';
import axios from 'axios';  

const filterBook = props => {

  let filterHandler = async (e) => {
    e.preventDefault();
    try {
      const obj = {
        filterName: props.filterName,
        filterAuthor: props.filterAuthor,
        filterUploader: props.filterUploader,
        filterGenres: props.filterGenres
      }
      const res = await axios.post('/api/books/filter/'+props.page_id, obj);
      props.filtered(res.data);
    }
    catch(ex) {
      alert(ex.response.data);
    }
  }

  return (
    <div className='mt-3 p-2' style={{border: '1px solid black'}}>
      <h3><b>Filter Books</b></h3> 
      <form >
      <div className="form-group">
          <Multiselect style={{
                  multiselectContainer: {
                    backgroundColor: 'white'
                  }
              }}
              options={props.genres}
              onSelect={props.onSelect}
              onRemove={props.onRemove}
              displayValue="name"
              placeholder="Book Genre"
          />
        </div>
        <div className="form-group">
          <label htmlFor="filterName" className='sr-only'>Title</label>
          <input type="text" 
                  className="form-control" 
                  id="filterName"
                  placeholder="Title" 
                  defaultValue={props.filterName}
                  onChange={props.changed}/>
        </div>
        <div className="form-group">
          <label htmlFor="filterAuthor" className='sr-only'>Author</label>
          <input type="text" 
                  className="form-control" 
                  id="filterAuthor"
                  defaultValue={props.filterAuthor}
                  placeholder="Author" 
                  onChange={props.changed}/>
        </div>
        
        <div className="form-group">
          <label htmlFor="filterUploader" className='sr-only'>Uploaded By</label>
          <input type="text" 
                  className="form-control" 
                  id="filterUploader"
                  placeholder="Uploaded By" 
                  defaultValue={props.filterUploader}
                  onChange={props.changed}/>
        </div>
      </form>
      <button type="submit" className="btn btn-primary" onClick={filterHandler}>Filter</button>
    </div>
  );
};

export default filterBook;