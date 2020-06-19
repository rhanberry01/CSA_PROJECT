import React from 'react';
import { Link, Switch, HashRouter, Route, Redirect,  BrowserRouter, withRouter } from "react-router-dom";

class Redirection extends React.Component {
  //This is to reload the component.
  render() {
    return (
      <Switch>
      <Redirect to="/sales/dynamic_table"/>
     </Switch>
      );
  }
}
export default Redirection;