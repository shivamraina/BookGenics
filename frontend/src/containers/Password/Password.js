import React, { Component } from 'react';
import classes from '../Settings/Settings.module.css';
import axios from 'axios';
import {Link} from 'react-router-dom';
import DashUserNav from '../../components/DashUserNav/DashUserNav';

function myFunctionKeyShow(){
  let x = document.getElementById("currPass");
  if (x.type === "password"){
    x.type = "text";
  } else{
    x.type = "password";
  }
}

function myFunctionKeyShow2(){
  let x = document.getElementById("newPass");
  if (x.type === "password"){
    x.type = "text";
  } else{
    x.type = "password";
  }
}

class Password extends Component {

  state = {
    currPass:'',
    newPass:'',
    loading: false,
  }

  onChangeHandler = (e) => {
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value });
  }

  doPasswordChange = async(e) => {
    e.preventDefault();
    const payload = {
      currPass: this.state.currPass,
      newPass: this.state.newPass
    };
    if (!this.state.newPass.match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/)) {
      alert(`*New Password - Must be at least 8 characters. At least 1 special character from @#$%&. At least 1 number, 1 lowercase, 1 uppercase letter`);
      return;
    }
    this.setState({loading: true});
    try {
      await axios.put('/api/user/me/pass', payload);
      this.setState({currPass:'', newPass:''});
      alert("Password Changed");
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
                    <label className="lead mx-2"><h3><b>Current Password</b></h3></label>
                    <input type="password" className="form-control" id="currPass" defaultValue='' onChange={this.onChangeHandler}/>
                  </div>
                  <div align="left">
                    <input id="keyShow"
                      type="checkbox"
                      onClick={(e)=> {myFunctionKeyShow(e)}}
                      /> &nbsp;<font size="3" face="Comic Sans">See Current Password</font>
                  </div>
                  <br />
                  <div className="form-row">
                    <label className="lead mx-2"><h3><b>New Password</b></h3></label>
                    <input type="password" className="form-control" id="newPass" defaultValue='' onChange={this.onChangeHandler}/>
                  </div>
                  <div align="left">
                    <input id="keyShow2"
                      type="checkbox"
                      onClick={(e)=> {myFunctionKeyShow2(e)}}
                      /> &nbsp;<font size="3" face="Comic Sans">See Confirm Password</font>
                  </div>
                  <div className="form-row">
                    <div className="d-flex justify-text-center col-sm-12 col-md-7">
                      <button className="btn btn-primary mb-5 mt-3 ml-auto" onClick={this.doPasswordChange}>Apply Changes</button>
                    </div>
                    <div className="col-sm-12 col-md-7">
                      <Link to="/settings"><button className="btn btn-info mb-5 ml-auto">Back to Settings</button></Link>
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

export default Password;