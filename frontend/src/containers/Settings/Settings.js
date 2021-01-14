import React, { Component } from 'react';
import classes from './Settings.module.css';
import DashUserNav from '../../components/DashUserNav/DashUserNav';
import axios from 'axios';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import { Multiselect } from 'multiselect-react-dropdown';

class Settings extends Component {

  state = {
    name:'',
    email: '',
    genres: [],
    allGenres: [],
    loading: false,
  }

  async componentDidMount() {
    this.setState({loading: true});
    try {
      const res = await axios.get('/api/user/me');
      const res2 = await axios.get('/api/genres');
      this.setState({name: res.data.name, genres: res.data.genres, loading: false, email: res.data.email, allGenres: res2.data});
    }
    catch(ex) {
      alert(ex.response.data);
      this.setState({loading: false});
    }
  }

  onChangeHandler = e => {
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value });
  }

  //changes filtering genres
  onSelect = (selectedList, selectedItem) => {
    this.setState({genres: selectedList});
  }
  
  //changes filtering genres
  onRemove = (selectedList, removedItem) => {
    this.setState({genres: selectedList});
  }

  applyChangeHandler = async (e) => {
    e.preventDefault();
    const payload = {
      name: this.state.name,
      email: this.state.email,
      genres: this.state.genres
    };
    this.setState({loading: true});
    try {
      const res = await axios.put('/api/user/me', payload);
      console.log(res);
      this.setState({name: res.data.name,  genres: res.data.genres, email: res.data.email});
      alert("Changes Applied");
      this.setState({loading: false});
    }
    catch(ex) {
      alert(ex.response.data);
      this.setState({loading: false});
    }
  }
 
  render() {
    let screen = (
      <React.Fragment>
        <div className={"jumbotron text-center py-4 "+classes.Jumbotron}>
          <h1>Change Your Account Information</h1>
        </div>
        <form className="container">
		      <div className="form-row">
            <div className="col-sm-12 col-md-3 ml-5">
              <label className="mt-2 lead mx-2"><h3><b>Name</b></h3></label>
            </div>
    		    <div className="col-7 ml-5">
      			  <input type="text" className="form-control" id="name" defaultValue={this.state.name} onChange={this.onChangeHandler}/>
    		    </div>
    	    </div>
        	<br />
          <div className="form-row">
          <div className="col-sm-12 col-md-3 ml-5">
              <label className="mt-2 lead mx-2"><h3><b>Email</b></h3></label>
            </div>
    		    <div className="col-7 ml-5">
      			  <input type="text" className="form-control" id="email" defaultValue={this.state.email} placeholder=""onChange={this.onChangeHandler}/>
    		    </div>
    	    </div>
          <br />
		      <div className="form-row">
            <div className="col-sm-12 col-md-3 ml-5">
              <label className="mt-2 lead mx-2"><h3><b>Preferred Genres</b></h3></label>
            </div>
    		    <div className="col-7 ml-5">
              <Multiselect style={{
                    multiselectContainer: {
                      backgroundColor: 'white'
                    }
                }}
                options={this.state.allGenres}
                selectedValues = {this.state.genres}
                onSelect={this.onSelect}
                onRemove={this.onRemove}
                displayValue="name"
            />
    		    </div>
    	    </div>
          <br />
        </form>
        <form className="container">
          <div className="form-row">
            <div className="col-sm-12 col-md-5 mt-3">
              <button className="btn btn-primary ml-5" onClick={this.applyChangeHandler}>Apply Changes</button>
            </div>
    		    <div className="col-sm-12 col-md-7 mb-5">
              <Link to='/password' style={{textDecoration: 'none'}}><button className="d-flex justify-content-end btn btn-danger ml-auto">Change Password</button></Link>
    		    </div>
    	    </div>
        </form>
      </React.Fragment>
    );

    if(this.state.loading){
      screen = <h1 className="text-center mt-5">Loading...</h1>
    }

    return (
      <div>
        <DashUserNav />
        {screen}
        <footer className="page-footer fixed-bottom" style={{backgroundColor: '#00695c', height:'25px'}}>
          <div className="footer-copyright text-center">
            <p style={{color:'white'}}>© 2020 Copyright: Developed Through Love</p>
          </div>	
        </footer>
      </div>
    );
  }
};

Settings.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Settings);