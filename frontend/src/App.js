import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser } from './store/actions/auth';
import store from "./store/store";

import Home from './components/Home/Home';
import Login from './containers/Login/Login';
import Register from './containers/Register/Register';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Dashboard from './containers/Dashboard/Dashboard';
import Favorites from './containers/Favorites/Favorites';
import BooksAdded from './containers/BooksAdded/BooksAdded';
import Predictor from './containers/Predictor/Predictor';
import Settings from './containers/Settings/Settings';
import Password from './containers/Password/Password';

class App extends Component {

  componentDidMount() {

    if (localStorage.jwtToken) {
      const token = localStorage.jwtToken;
      setAuthToken(token);
      const decoded = jwt_decode(token);
      store.dispatch(setCurrentUser(decoded));
    }

  }

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={Register} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/favorites" component={Favorites} />
            <PrivateRoute exact path="/booksadded" component={BooksAdded} />
            <PrivateRoute exact path="/predictor" component={Predictor} />
            <PrivateRoute exact path="/settings" component={Settings} />
            <PrivateRoute exact path="/password" component={Password} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
};

export default App;