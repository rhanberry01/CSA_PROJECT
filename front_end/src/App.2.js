import React, { Component } from 'react';
import { Redirect, HashRouter, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import './App.css';
// Styles
// CoreUI Icons Set
import '@coreui/icons/css/coreui-icons.min.css';
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import './scss/style.css'

// Containers
import { DefaultLayout } from './containers';
// Pages
import { Login, Page404, Page500, Register } from './views/Pages';

// import { renderRoutes } from 'react-router-config';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
       UserSession: [],
    }
  }

  componentWillMount() {
    axios.defaults.withCredentials = true; //dont forget this to get sessions
    axios.get('http://192.168.0.188:4001/users/getusersession')
    .then(res => {
      const UserSession = res.data;
      this.setState(
        { 
          isLoggedin: UserSession.loggedin 
        }
      );
      //console.log(UserSession);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  
render() {

    if (this.state.isLoggedin!=true){
      return (
      <HashRouter>
      <Switch>
      <Route path="/login" name="Login Page" component={Login} />
      </Switch>
      </HashRouter>
      );
    }
    else{
      return (
        <HashRouter>
          <Switch>
          <Route path="/" name="Home" component={DefaultLayout} />
          </Switch>
        </HashRouter>
      );
    }



  }
}

{/*
<Route exact path="/register" name="Register Page" component={Register} />
<Route exact path="/404" name="Page 404" component={Page404} />
<Route exact path="/500" name="Page 500" component={Page500} />
*/}

export default App;
