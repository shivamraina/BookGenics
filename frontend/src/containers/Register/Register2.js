import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actionCreators from '../../store/actions/index';
import axios from 'axios';
import classes from './Register2.module.css';

function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  return splitStr.join(' '); 
}

class Register2 extends Component {

  state = {
    genres: [],
    loading: false,
    selected: {},
    totalSelected: 0
  };

  async componentDidMount() {
    this.setState({loading: true});
    try {
      const res = await axios.get('/api/genres');
      let temp = {};
      for (let idx in res.data) {
        temp[res.data[idx]._id] = false
      }
      this.setState({genres: res.data, loading: false, selected:temp});
    }
    catch(ex) {
      alert(ex.response.data);
      this.setState({loading: false})
    }
  }

  handleRegisterHandler = async(e) => {
    e.preventDefault();
    this.setState({loading: true});
    const newUser = {
      name: this.props.name,
      email: this.props.email,
      password: this.props.password,
      genresPreferred: []
    };
    let genreArray = [];
    for(let id in this.state.selected) {
      if(this.state.selected[id]) genreArray.push(id)
    }
    newUser.genresPreferred = genreArray;
    try{
      this.props.registerUser(newUser, this.props.history);
      this.setState({loading: false});
    }
    catch(ex) {
      alert(ex.response.data);
      this.setState({loading: false});
    }
  }

  cardClickHandler = (id) => {
    if(this.state.selected[id]) {
      let obj = this.state.selected;
      obj[id] = false;
      let newTotalSelected = this.state.totalSelected-1;
      this.setState({selected: obj, totalSelected: newTotalSelected});
    }
    else {
      let obj = this.state.selected;
      obj[id] = true;
      let newTotalSelected = this.state.totalSelected+1;
      this.setState({selected: obj, totalSelected: newTotalSelected});
    }
  }

  render() {
    
    let screen;
    if(this.state.loading) {
      screen = <h1 className='text-center mt-5'>Loading...</h1>;
    }

    else {
      screen = <div className="row">
                <div className="col-12">
                  <h1 className={classes.Heading}>Your Favorite Genres</h1>
                </div>
                <div className="col-md-10">
                  <div className="row">
                    {this.state.genres.map(genre => {
                      if(this.state.selected[genre._id]) {
                        return (
                          <div className="col col-sm-12 col-md-4" key={genre._id}>
                            <div 
                            className={"card my-2 "+classes.CardSelected} 
                            style={{width: '15rem', height:'6rem'}} 
                            onClick={(id) => this.cardClickHandler(genre._id)}
                            >
                              <div className="card-body pt-4">
                                <p className="card-text text-center">{titleCase(genre.name)}</p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      else {
                        return (
                          <div className="col col-sm-12 col-md-4" key={genre._id}>
                            <div 
                            className={"card my-2 "+classes.Card} 
                            style={{width: '15rem', height:'6rem'}} 
                            onClick={(id) => this.cardClickHandler(genre._id)}
                            >
                              <div className="card-body pt-4">
                                <p className="card-text text-center">{titleCase(genre.name)}</p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
                <div className="col-md-2 mt-3">
                  {this.state.totalSelected>0?
                    <button className={"btn btn-block mb-4 "+classes['register-btn']} 
                        type='submit' onClick={this.handleRegisterHandler}
                        >Register</button> :
                    <button className={"btn btn-block mb-4 "+classes['disabled-register-btn']} 
                        type='submit' 
                        disabled={this.state.totalSelected<=0}>Register</button> 
                  }
                  <button className={"btn btn-block mb-4 "+classes['back-btn']} onClick={this.props.clicked}>Back</button>
                </div>
              </div>
              
    }

    return (
      <div className="container">
        {screen}
      </div>
    );
  }
};

Register2.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    errors: state.error
  }
};

const mapDispatchToProps = dispatch => {
  return {
    registerUser: (userData, history) => dispatch(actionCreators.registerUser(userData, history))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Register2));