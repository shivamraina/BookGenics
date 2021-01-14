import React from 'react';
import SortBook from '../SortBook/SortBook';
import FilterBook from '../FilterBook/FilterBook';

const bookUtils = props => (
  <React.Fragment>
     <h4 className="mt-2">
      <strong>Welcome,</strong> <b>{props.name}</b>
    </h4>
    <SortBook sorted={props.sorted}/>
    <FilterBook 
      genres={props.genres} 
      filtered={props.filtered} 
      page_id={props.page_id} 
      changed={props.changed}
      filterName={props.filterName}
      filterAuthor={props.filterAuthor}
      filterUploader={props.filterUploader}
      filterGenres={props.filterGenres}
      onSelect={props.onSelect}
      onRemove={props.onRemove}/>
  </React.Fragment>
);

export default bookUtils;