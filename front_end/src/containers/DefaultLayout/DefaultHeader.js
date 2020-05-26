import React, { Component } from 'react';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/logo.png'
import sygnet from '../../assets/img/brand/sygnet.svg'

import axios from 'axios';
import { BACKENDIP, BACKENDPORT } from '../../Database';

import { BrowserRouter, Redirect, HashRouter, Route, Switch } from 'react-router-dom';
import { Login } from '../../../src/views/Pages';
//import { DefaultLayout } from '../../../src/containers';
import Swal from 'sweetalert2'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {

    constructor(props) {
      super(props);

      this.state = { 
        UserSession: [], 
        toRedirect: false,
        BranchSession: [],
      }

      this.logOut = this.logOut.bind(this);
    }

    componentDidMount(){
      axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/users/getusersession')
      .then(res => {
       const BranchSession = res.data;
        this.setState({  BranchSession: BranchSession.branch_name });  
       //console.log(BranchSession)
      })
      .catch(function (error) {
       console.log(error);
      });
    }

  logOut() {
    Swal({
      title: 'Hello!',
      text: "Are you sure to Logout?",
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {

    if (result.value) {
    axios.defaults.withCredentials = true; //dont forget this to get sessions
    axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/users/logout')
    .then(res => {
     const UserSession = res.data;
     this.setState(
       { 
        isLoggedin: UserSession.loggedin,
        toRedirect:true 
        }
      );
    })
    .catch(function (error) {
     console.log(error);
    });
    window.location = "/"
  }
})
}

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    //const totaldeposited = this.state.DepType.map((DepType, i) => DepType.branch);
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 70, height: 32, alt: 'CoreUI Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <h6> {this.state.BranchSession} BRANCH</h6>
        { /*
        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink href="/">Dashboard</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="#/users">Users</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="#">Settings</NavLink>
          </NavItem>
        </Nav>
             */
          }

        <Nav className="ml-auto" navbar>
        
   

        {/*
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-bell"></i><Badge pill color="danger">5</Badge></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-list"></i></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-location-pin"></i></NavLink>
          </NavItem>
          */
        }
      
         
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <img src={'assets/img/avatars/avatar-key5.png'} className="img-avatar" alt="admin@bootstrapmaster.com" />
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
            {/*
              <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
              <DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
              <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
              <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
              <DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem>
              <DropdownItem divider />
              <DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem>
              */
            }
              <DropdownItem onClick={this.logOut}><i className="fa fa-lock" ></i> Logout</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
        {/*<AppAsideToggler className="d-md-down-none" />*/}
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
