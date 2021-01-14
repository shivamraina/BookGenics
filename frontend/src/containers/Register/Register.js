import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classes from './Register.module.css';
import Image from '../../assets/images/booksimage.jpg';
import HomeNavbar from '../../components/Home/HomeNavbar/HomeNavbar';
import * as actionCreators from '../../store/actions/index';
import Register2 from './Register2';
import axios from 'axios';

function myFunctionKeyShow(){
  let x = document.getElementById("password");
  if (x.type === "password"){
    x.type = "text";
  } else{
    x.type = "password";
  }
}

function myFunctionKeyShow2(){
  let x = document.getElementById("confirmPassword");
  if (x.type === "password"){
    x.type = "text";
  } else{
    x.type = "password";
  }
}
class Register extends Component {

  state = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    loading: false,
    errors: {},
    show: false
  };

  validateForm() {

    let errors = {};
    let formIsValid = true;

    if (!this.state.name) {
      formIsValid = false;
      errors["name"] = "*Please enter your username.";
    }

    if (typeof this.state.name !== "undefined") {
      if (!this.state.name.match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        errors["name"] = "*Please enter alphabet characters only.";
      }
    }

    if (!this.state.email) {
      formIsValid = false;
      errors["email"] = "*Please enter your email-ID.";
    }

    if (typeof this.state.email !== "undefined") {
      //regular expression for email validation
      var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if (!pattern.test(this.state.email)) {
        formIsValid = false;
        errors["email"] = "*Please enter valid email-ID.";
      }
    }

    if (!this.state.password) {
      formIsValid = false;
      errors["password"] = "*Please enter your password.";
    }

    if (typeof this.state.password !== "undefined") {
      if (!this.state.password.match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/)) {
        formIsValid = false;
        errors["password"] = `*Must be at least 8 characters. At least 1 special character from @#$%&. At least 1 number, 1 lowercase, 1 uppercase letter`
        // Must be at least 8 characters. At least 1 special character from @#$%&. At least 1 number, 1 lowercase, 1 uppercase letter;
      }
    }

    if (!this.state.confirmPassword) {
      formIsValid = false;
      errors["confirmPassword"] = "*Please confirm your password.";
    }

    if (typeof this.state.password !== "undefined") {
      if(this.state.password !== this.state.confirmPassword) {
        formIsValid = false;
        errors["confirmPassword"] = "*Passwords don't match.";
      }
    }

    this.setState({
      errors: errors
    });
    
    return formIsValid;
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    
    if(!this.validateForm()) {
      return;
    }

    this.setState({loading:true});
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword
    };

    try{
      await axios.post('/api/user/register/check', newUser);
      this.setState({loading: false, show:true});
    }
    catch(ex) {
      alert(ex.response.data);
      this.setState({loading: false});
    }
  }

  backButtonHandler = () => {
    this.setState({show:false});
  }

  render() {

    let form;
    
    if(this.state.loading) {
      form = <h1 className='mt-5'>Loading...</h1>
    }
    else if(this.state.show) {
      form = <Register2 
              name={this.state.name} 
              email={this.state.email} 
              password={this.state.password} 
              clicked={this.backButtonHandler}/>
    }

    else {
      form = (
            <div>
              <main className="d-flex align-items-center">
                <div className="container">
                  <div className={'card '+classes['register-card']}>
                    <div className="row no-gutters">
                      <div className="col-md-5">
                        <img src={Image} alt="login" className={classes["register-card-img"]} />
                      </div>
                      <div className="col-md-7">
                        <div className={classes["card-body"]}>
                          <p className={classes["register-card-description"]}>Create a new account</p>
                          <form noValidate onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label htmlFor="Name" className="sr-only">Full Name</label>
                                <input  type="text" 
                                        className="form-control"
                                        id="name" 
                                        onChange={this.onChange}
                                        value={this.state.name}
                                        placeholder="Enter name" required/>
                                <div className={classes["errMsg"]}>{this.state.errors.name}</div>
                            </div>
                            <div className="form-group">
                              <label htmlFor="email" className="sr-only">Email</label>
                              <input  type="email"
                                      name="email"
                                      id="email"
                                      onChange={this.onChange}
                                      value={this.state.email}
                                      className="form-control"
                                      placeholder="Email address" required/>
                                <div className={classes["errMsg"]}>{this.state.errors.name?null:this.state.errors.email}</div>
                            </div>
                            <div className="form-group">
                              <label htmlFor="password" className="sr-only">Password</label>
                              <input  type="password" 
                                      name="password" 
                                      id="password" 
                                      onChange={this.onChange}
                                      value={this.state.password}
                                      className="form-control" 
                                      placeholder="Enter Password" required/>
                              <div className={classes["errMsg"]}>{this.state.errors.email?null:this.state.errors.password}</div>
                              <input  id="keyShow"
                                      type="checkbox"
                                      onClick={(e)=> {myFunctionKeyShow(e)}}
                                  /> &nbsp;<font size="3" face="Comic Sans">See Password</font>
                            </div>
                            <div className="form-group">
                              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                              <input  type="password" 
                                      className="form-control" 
                                      onChange={this.onChange}
                                      value={this.state.confirmPassword}
                                      id="confirmPassword" 
                                      placeholder="Re-enter Password" required/>
                              <div className={classes["errMsg"]}>{this.state.errors.password?null:this.state.errors.confirmPassword}</div>
                              <input  id="keyShow2"
                                      type="checkbox"
                                      onClick={(e)=> {myFunctionKeyShow2(e)}}
                                  /> &nbsp;<font size="3" face="Comic Sans">See Confirm Password</font>
                            </div>
                            <button className={"btn btn-block mb-4 "+classes['register-btn']} type='submit'>Next</button>
                          </form>
                          <p className={classes["register-card-footer-text"]}>Already have an account?<Link to="/login"> Login</Link></p>
                          <Link to='/'><span>Back To Home</span></Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          );
    }

    return(
      <div className={classes["body"]}>
        <HomeNavbar />
        {form}
      </div>
    );
  }
};

Register.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Register));