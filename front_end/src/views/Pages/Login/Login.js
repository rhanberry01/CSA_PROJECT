import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Label,
} from "reactstrap";
import axios from "axios";
import { BACKENDIP, BACKENDPORT } from "../../../Database";

import {
  HashRouter,
  Link,
  Switch,
  Route,
  withRouter,
  Redirect,
} from "react-router-dom";
// Containers
import { DefaultLayout } from "../../../containers";
import Swal from "sweetalert2";

class Login extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      SelectedUser: [],
      toRedirect: false,
      Banks: [],
      branch_login: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlebranchloginChange = this.handlebranchloginChange.bind(this);
  }

  handlebranchloginChange(e) {
    this.setState({
      branch_login: e.target.value,
    });
    //console.log(e.target.value);
  }

  componentDidMount() {
    this._isMounted = true;
    axios.defaults.withCredentials = true;
    axios
      .get("http://" + BACKENDIP + ":" + BACKENDPORT + "/users/getbranches")
      .then((res) => {
        const Banks = res.data;
        if (this._isMounted) {
          this.setState({
            Banks: Banks,
          });
        }
        //console.log(Banks[0]);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleSubmit(e) {
    //alert('An essay was submitted: ' + this.state.e);
    e.preventDefault();
    const LoginFormData = {
      username: this.state.username,
      password: this.state.password,
      branch_login: this.state.branch_login,
    };
    //alert(LoginFormData.username);
    // alert(LoginFormData.password);

    axios.defaults.withCredentials = true;
    axios
      .get("http://" + BACKENDIP + ":" + BACKENDPORT + "/users/getuser", {
        withCredentials: true,
        params: {
          user_id: LoginFormData.username,
          password: LoginFormData.password,
          branch_login: LoginFormData.branch_login,
        },
      })
      .then((res) => {
        const SelectedUser = res.data;
        this.setState({
          SelectedUser,
        });
        //console.log(SelectedUser);
        if (SelectedUser != "") {
          this.setState({
            toRedirect: true,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
        Swal(
          "Login failed!",
          "No user account found, Incorrect Username or Password.",
          "warning"
        );
        return;
      });
  }

  handleChange(e) {
    // check it out: we get the evt.target.name (which will be either "email" or "password")
    // and use it to target the key on our `state` object with the same name, using bracket syntax
    this.setState({
      [e.target.name]: e.target.value,
    });
    //console.log(e.target.value);
  }

  render() {
    if (this.state.toRedirect === true) {
      return (
        <HashRouter>
          <div>
            <Switch>
              <Route path="/" name="Home" component={DefaultLayout} />{" "}
            </Switch>{" "}
          </div>
        </HashRouter>
      );
    }
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="5">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.handleSubmit}>
                      <h1> Login </h1>
                      {/*this.state.SelectedUser.map((SelectedUser, i) => <option key={SelectedUser.id}>{SelectedUser.id}</option>)*/}
                      <p className="text-muted"> Sign In to your account </p>{" "}
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"> </i>{" "}
                          </InputGroupText>{" "}
                        </InputGroupAddon>{" "}
                        <Input
                          type="text"
                          id="username"
                          name="username"
                          placeholder="Username"
                          autoComplete="username"
                          value={this.state.username}
                          onChange={this.handleChange}
                        />{" "}
                      </InputGroup>{" "}
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"> </i>{" "}
                          </InputGroupText>{" "}
                        </InputGroupAddon>{" "}
                        <Input
                          type="password"
                          id="password"
                          name="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          value={this.state.password}
                          onChange={this.handleChange}
                        />{" "}
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-location-pin"> </i>{" "}
                          </InputGroupText>{" "}
                        </InputGroupAddon>{" "}
                        <Input
                          type="select"
                          name="branch_login"
                          id="branch_login"
                          value={this.state.branch_login}
                          onChange={this.handlebranchloginChange}
                        >
                          {" "}
                          {this.state.Banks.map((Banks, i) => (
                            <option key={Banks.br_code} value={i}>
                              {" "}
                              {Banks.br_name}{" "}
                            </option>
                          ))}{" "}
                        </Input>{" "}
                      </InputGroup>{" "}
                      <Row>
                        <Col xs="6">
                          <Button
                            type="submit"
                            color="primary"
                            className="px-4"
                          >
                            {" "}
                            Login{" "}
                          </Button>{" "}
                        </Col>{" "}
                      </Row>{" "}
                    </Form>{" "}
                  </CardBody>{" "}
                </Card>{" "}
              </CardGroup>{" "}
            </Col>{" "}
          </Row>{" "}
        </Container>{" "}
      </div>
    );
  }
}

export default withRouter(Login);
