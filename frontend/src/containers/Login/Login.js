import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classes from './Login.module.css';
import Image from '../../assets/images/booksimage.jpg';
import HomeNavbar from '../../components/Home/HomeNavbar/HomeNavbar';
import * as actionCreators from '../../store/actions/index';

function myFunctionKeyShow(){
  let x = document.getElementById("password");
  if (x.type === "password"){
    x.type = "text";
  } else{
    x.type = "password";
  }
}

class Login extends Component {

  state = {
    email: '',
    password: '',
    loading: false,
  };

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.auth.isAuthenticated) {
      nextProps.history.push("/dashboard");
    }
    return null
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();

    this.setState({loading: true});
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData);
    this.setState({loading: false});
  }

  render() {
    const {err} = this.props.errors;

    let form = (
      <div>
        <main className="d-flex align-items-center">
          <div className="container">
            <div className={"card "+classes['login-card']}>
              <div className="row no-gutters">
                <div className="col-md-5">
                  <img src={Image} alt="login" className={classes['login-card-img']} />
                </div>
                <div className="col-md-7">
                  <div className={classes['card-body']}>
                    <p className={classes['login-card-description']}>Sign into your account</p>
                    <form noValidate onSubmit={this.onSubmit}>
                      <div className="form-group">
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input type="email"
                                name="email"
                                id="email"
                                onChange={this.onChange}
                                value={this.state.email}
                                className="form-control"
                                placeholder="Email address" required/>
                          <span className={classes['errMsg']}>{err?err.email:null}</span>
                      </div>
                      <div className="form-group mb-4">
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input  type="password" 
                                name="password" 
                                id="password" 
                                onChange={this.onChange}
                                value={this.state.password}
                                className="form-control" 
                                placeholder="Enter Password" required/>
                        <div className={classes['errMsg']}>{err?err.password:null}</div>
                        <input id="keyShow"
                            type="checkbox"
                            onClick={(e)=> {myFunctionKeyShow(e)}}
                            /> &nbsp;<font size="3" face="Comic Sans">See Password</font>
                      </div>
                      <button className={"btn btn-block mb-4 "+classes['login-btn']} type='submit'>Login</button>
                    </form>
                    <p className={classes['login-card-footer-text']}>Don't have an account?<Link to="/register"> Register</Link></p>
                    <Link to='/'><span>Back To Home</span></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
    
    return(
      <div className={classes['body']}>
        <HomeNavbar />
        {form}
      </div>
    );
  }
};

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
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
    loginUser: (userData) => dispatch(actionCreators.loginUser(userData))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));

// validateForm() {
//   let errors = {};
//   let formIsValid = true;

//   if (!this.state.email) {
//     formIsValid = false;
//     errors["email"] = "*Please enter your email-ID.";
//   }
  
//   if (typeof this.state.email !== "undefined") {
//     //regular expression for email validation
//     var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
//     if (!pattern.test(this.state.email)) {
//       formIsValid = false;
//       errors["email"] = "*Please enter valid email-ID.";
//     }
//   }

//   if (!this.state.password) {
//     formIsValid = false;
//     errors["password"] = "*Please enter your password.";
//   }

//   this.setState({
//     errors: errors
//   });

//   return formIsValid;
// }