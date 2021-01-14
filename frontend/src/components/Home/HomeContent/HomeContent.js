import React from 'react';
import classes from './HomeContent.module.css'

const homeContent = props => (
  <div className={classes.Div}>
    <h1 className={classes.H1}>BOOKGENICS</h1>
    <h3 className={classes.H3}>Your One Stop Solution for Genre Prediction</h3>
  </div>
);

export default homeContent;