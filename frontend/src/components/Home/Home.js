import React from 'react';
import HomeNavbar from './HomeNavbar/HomeNavbar';
import HomeContent from './HomeContent/HomeContent';
import classes from './Home.module.css';

const home = props => (
  <div className={classes.Body}>
    <HomeNavbar />
    <HomeContent />
  </div>
);

export default home;