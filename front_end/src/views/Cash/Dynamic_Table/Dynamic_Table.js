import React, {Component} from 'react';
import { render, findDOMNode } from 'react-dom';
import axios from 'axios';
import { BACKENDIP, BACKENDPORT } from '../../../Database';

import { Badge, Row, Col, Card, CardHeader, CardBody, CardFooter, 
Collapse, Table, Button,
Pagination, PaginationItem, PaginationLink,
Modal, ModalHeader, ModalBody, ModalFooter,
Form,FormGroup,FormText,Label, 
Input, InputGroup, InputGroupAddon, InputGroupText,
Dropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown,Alert,UncontrolledAlert} from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { IntlProvider, FormattedMessage, FormattedNumber } from 'react-intl';
import Spinner from 'react-spinkit';
import Loadable from 'react-loadable';
import { ToastContainer,toast } from 'react-toastify';
import SweetAlert from 'react-bootstrap-sweetalert';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { createHashHistory,createBrowserHistory  } from 'history'
//BrowserRouter as Router,
import { Link, Switch, HashRouter, Route, Redirect,  BrowserRouter, withRouter } from "react-router-dom";
//import { withRouter } from "react-router";

class CashDeposit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
      Deposits: [],
       toRedirect: false,
       reload: this.props.status,
       large: false,
       amount: '',
       memo: '',
       bal: '',
       tCash: [],
       tDep: [],
       tWith: [],
       salesDate: moment(),
       depositDate: moment(),
       transaction_detail_type: '',
       aria_trans_gl_code: '',
       DepType: [],
       Banks: [],
       visible: false,
       alert: null,
       events:'',
       checker: false,
       maping: false,

    }
 

 this.openAddModal = this.openAddModal.bind(this);
 this.handleChange = this.handleChange.bind(this);
 this.handleSalesDateChange = this.handleSalesDateChange.bind(this);
 this.handleDepositDateChange = this.handleDepositDateChange.bind(this);
 this.handledeptypeChange = this.handledeptypeChange.bind(this);
 this.handlebanktypeChange = this.handlebanktypeChange.bind(this);
 this.onDismiss = this.onDismiss.bind(this);
 this.hideAlert = this.hideAlert.bind(this);
 this.handleAdd = this.handleAdd.bind(this);

}

//-----START OF TABLE PART
loadDeposits() {
  axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/cashdeposit/getdeposit')
    .then(res => {
      const Deposits = res.data;
      this.setState({ Deposits });
      console.log("x");
    })
    .catch(function (error) {
      console.log(error);
    });
}

getInitialState() {
  return { Deposits: [] };
}

componentDidMount(){
  console.log("component did mount");
  this.loadDeposits();
  this.setState({ maping: true }); 
}

//----START OF ADD PART
openAddModal() {
console.log("clicked.");
this.setState({
 large: !this.state.large
});

axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/cashdeposit/deposittypedropdown')
.then(res => {
 const DepType = res.data;
 this.setState({ DepType });
})
.catch(function (error) {
 console.log(error);
});

axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/cashdeposit/bankdropdown')
.then(res => {
const Banks = res.data;
this.setState({ Banks });
})
.catch(function (error) {
console.log(error);
});
}

handleDepositDateChange (date) {
this.setState({
 depositDate: date
});
}

handleSalesDateChange (date) {
this.setState({
 salesDate: date
});

axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/cashdeposit/getsalescash', {
params:{ 
   remittance_date: moment(date).format('YYYY-MM-DD')
   }
 })
.then(res => {
 const tCash = res.data;
 this.setState({ tCash });
 console.log(tCash);
 console.log(moment(date).format('YYYY-MM-DD'));
})
.catch(function (error) {
 console.log(error);
});  

axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/cashdeposit/getsalesdeposited', {
 params:{ 
     remittance_date: moment(date).format('YYYY-MM-DD')
     }
   })
 .then(res => {
   const tDep = res.data;
   this.setState({ tDep });
   console.log(tDep);
   console.log(moment(date).format('YYYY-MM-DD'));
 })
 .catch(function (error) {
   console.log(error);
 });
 
 axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/cashdeposit/getsaleswithdrawal', {
   params:{ 
       remittance_date: moment(date).format('YYYY-MM-DD')
       }
     })
   .then(res => {
     const tWith = res.data;
     this.setState({ tWith });
     console.log(tWith);
     console.log(moment(date).format('YYYY-MM-DD'));
   })
   .catch(function (error) {
     console.log(error);
   });  
}

handleChange (e) {
// check it out: we get the evt.target.name (which will be either "email" or "password")
// and use it to target the key on our `state` object with the same name, using bracket syntax
this.setState({ [e.target.name]: e.target.value });
console.log(this.state.value);
}

handledeptypeChange(e) {
this.setState({transaction_detail_type: e.target.value});
}

handlebanktypeChange(e) {
this.setState({aria_trans_gl_code: e.target.value});
}

onDismiss() {
this.setState({ visible: false });
}

hideAlert() {
console.log('Cancelled.');
this.setState({
alert: null
});
}

handleAdd(e){
//const MySwal = withReactContent(Swal)
console.log(e); 
e.preventDefault();
e.persist(); //to remove synthetic event
Swal({
 title: 'Are you sure?',
 text: "Double check the information.",
 type: 'info',
 showCancelButton: true,
 confirmButtonColor: '#3085d6',
 cancelButtonColor: '#d33',
 confirmButtonText: 'Yes, Continue!'
}).then((result) => {
 if (result.value) {

   console.log('true.');
     const Deposit = {
       bal: e.target.bal.value,
       amount: this.state.amount,
       memo: this.state.memo,
       transaction_date: this.state.salesDate,
       date_created: this.state.depositDate,
       transaction_detail_type: this.state.transaction_detail_type,
       aria_trans_gl_code: this.state.aria_trans_gl_code
     };
 
       var b = new Number(Deposit.bal);
       var a = new Number(Deposit.amount);
       console.log(b);
       console.log(a);
 
       if (Number(a) > Number(b)) {
        Swal({
          type: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
         //console.log("invalid");
         //alert("invalid");
         this.setState({ visible:false });
       } else {
         console.log(Deposit);
         axios.post('http://'+BACKENDIP+':'+BACKENDPORT+'/cashdeposit/adddeposit', { 
           bal: Deposit.bal,
           amount: Deposit.amount,
           memo: Deposit.memo,
           transaction_date: moment(this.state.salesDate).format('YYYY-MM-DD'),
           date_created: moment(this.state.depositDate).format('YYYY-MM-DD'),
           transaction_detail_type: Deposit.transaction_detail_type,
           aria_trans_gl_code: Deposit.aria_trans_gl_code
         })
         .then(res => {
          
           console.log(res);
           console.log(res.data);
           Swal(
             'Successful!',
             'Your deposit has been Added.',
             'success'
           );
          // this.props.history.push("/sales/sales_audit")
          this.setState({ toRedirect:true });
         })
       }
 }
})
}
 
render() {
  if (this.state.toRedirect === true){
  console.log("go1");
    return (
      <Switch>
       <Route path="/sales/dynamic_table" component={CashDeposit}/>
      </Switch>
      );
    }
  else{
  console.log("go2");
    return (

   
    <div className="animated fadeIn">
   
    <Row>
      <Col>           
      <Button color="success" className="float-right" onClick={this.openAddModal}><i className="fa fa-plus-square"></i>&nbsp; Record Cash Deposit</Button>
            <Modal isOpen={this.state.large} toggle={this.openAddModal}
                   className={'modal-lg ' + this.props.className}>
              <ModalHeader toggle={this.openAddModal}>Cash Deposit</ModalHeader>
              <ModalBody>
              <Card>
              <CardHeader>
                <strong>Add New Deposit</strong>
              </CardHeader>
              <CardBody>
                <Form onSubmit={this.handleAdd}>
                <Row>
                    <Col xs="6">
                    <FormGroup>
                    <Label htmlFor="salesDate">Sales Date:</Label>
                    <DatePicker selected={this.state.salesDate} onChange={this.handleSalesDateChange} maxDate={moment()} minDate={moment().subtract(5, "days")}/> 
                    </FormGroup>
                    </Col>
                    <Col xs="6">
                      {this.state.tCash.map((tCash, i) => <h6 key = {i}>{ "Cash from Sales: "+tCash.cash}</h6>)}
                      {this.state.tDep.map((tDep, i) => <h6 key = {i}>{ "Deposited: "+tDep.cash}</h6>)}
                      {this.state.tWith.map((tWith, i) => <h6 key = {i}>{ "Withdrawal: "+tWith.cash}</h6>)}
                      {<h6>Total Balance: {this.state.tCash.map((tCash, i) => tCash.cash)-this.state.tDep.map((tDep, i) => tDep.cash)-this.state.tWith.map((tWith, i) => tWith.cash)}</h6>}
                    <FormGroup>
                    <Input type="hidden" id="bal" name="bal" value={this.state.tCash.map((tCash, i) => tCash.cash)-this.state.tDep.map((tDep, i) => tDep.cash)-this.state.tWith.map((tWith, i) => tWith.cash)} onChange={this.handleSalesDateChange}/>
                    </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs="6">
                    <FormGroup>
                    <Label htmlFor="depositDate">Deposit Date:</Label>
                    <DatePicker selected={this.state.depositDate} onChange={this.handleDepositDateChange} maxDate={moment()} minDate={moment().subtract(5, "days")}/> 
                    </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs="4">
                    <FormGroup>
                    <Label htmlFor="bankdropdown">Bank Account:</Label>
                    <Input type="select" name="aria_trans_gl_code" id="aria_trans_gl_code" value={this.state.aria_trans_gl_code} onChange={this.handlebanktypeChange}>
                    {this.state.Banks.map((Banks, i) => <option key={Banks.account_code} value={Banks.account_code}>{Banks.bank_account_name}</option>)}
                    </Input>
                    </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                      <Label htmlFor="transaction_detail_type">Type:</Label>
                      <Input type="select" name="transaction_detail_type" id="transaction_detail_type" value={this.state.transaction_detail_type} onChange={this.handledeptypeChange}>
                      {this.state.DepType.map((DepType, i) => <option key={DepType.id} value={DepType.id}>{DepType.name}</option>)}
                      </Input>
                      </FormGroup>
                    </Col>
                    </Row>
                  <FormGroup row>
                    <Col sm="8">
                    <Label htmlFor="amount">Amount:</Label>
                    <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismiss}>
                    The amount entered is greater than remaining balance!
                    </Alert>
                    <Input type="text" id="amount" name="amount" placeholder="Enter Amount.." value={this.state.amount} onChange={this.handleChange}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="file-input">Attach Deposit Slip:</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="file" id="depositslip" name="depositslip"/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col xs="8">
                    <Label htmlFor="memo">Memo:</Label>
                    <Input type="textarea" name="memo" id="memo" rows="3" placeholder="Enter Memo..." value={this.state.memo} onChange={this.handleChange}/>
                    </Col>
                  </FormGroup>
                  <Button type="submit" size="sm" color="primary" aria-hidden="true" ><i className="fa fa-dot-circle-o"></i> Submit</Button>
                  </Form>
              </CardBody>
              </Card>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={this.openModal}>Close</Button>
              </ModalFooter>
            </Modal>
      </Col>
    </Row>
      <div>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-shopping-cart"></i> Cash Deposit (Sales)
              </CardHeader>
              <CardBody>
              <Table hover bordered striped responsive size="sm">
                
                  <thead>
                  <tr>
                    <th>Branch</th>
                    <th>Book#</th>
                    <th>Date Deposit</th>
                    <th>Sales Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Memo</th>
                    <th>Status</th>
                    <th>Update</th>
                    <th>Delete</th>
                  </tr>
                  </thead>

                <tbody>{  this.state.Deposits.map((Deposits, i) => <TableRow key = {i} data = {Deposits}/>) }</tbody> 
                </Table>
                  
                <nav>
                <Pagination>
                  <PaginationItem><PaginationLink previous href="#">Prev</PaginationLink></PaginationItem>
                  <PaginationItem active>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink href="#">4</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink next href="#">Next</PaginationLink></PaginationItem>
                </Pagination>
              </nav>
    
              </CardBody>
            </Card>
          </Col>
        </Row>
        </div>

      </div>

      
    )
  }
}
}


class TableRow extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      id: '',
      large: false,
      bal: '',
      tCash: [],
      tDep: [],
      tWith: [],
      DepType: [],
      Banks: [],
      visible: false,
      toRedirect: false,

      idx:this.props.data.id,
      name:this.props.data.name,
      date_created:this.props.data.date_created,
      amount:this.props.data._net_amount,
      memo:this.props.data.memo_,
      aria_trans_gl_code: this.props.data.aria_trans_gl_code,
      transaction_detail_type:this.props.data.transaction_detail_type,
      salesDate: moment(this.props.data.date_created),
      depositDate: moment(this.props.data.transaction_date),

    };

    this.openModal = this.openModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSalesDateChange = this.handleSalesDateChange.bind(this);
    this.handleDepositDateChange = this.handleDepositDateChange.bind(this);
    this.handledeptypeChange = this.handledeptypeChange.bind(this);
    this.handlebanktypeChange = this.handlebanktypeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  openModal() {
    this.setState({
      large: !this.state.large
    });

    axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/cashdeposit/deposittypedropdown')
    .then(res => {
      const DepType = res.data;
      this.setState({ DepType });
    })
    .catch(function (error) {
      console.log(error);
    });

  axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/cashdeposit/bankdropdown')
  .then(res => {
    const Banks = res.data;
    this.setState({ Banks });
  })
  .catch(function (error) {
    console.log(error);
  });

  }
  
  handleDepositDateChange (date) {
    this.setState({
      depositDate: date
    });
  }

  handleSalesDateChange (date) {
    this.setState({
      salesDate: date
    });

    axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/cashdeposit/getsalescash', {
    params:{ 
        remittance_date: moment(date).format('YYYY-MM-DD')
        }
      })
    .then(res => {
      const tCash = res.data;
      this.setState({ tCash });
      console.log(tCash);
      console.log(moment(date).format('YYYY-MM-DD'));
    })
    .catch(function (error) {
      console.log(error);
    });  

    axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/cashdeposit/getsalesdeposited', {
      params:{ 
          remittance_date: moment(date).format('YYYY-MM-DD')
          }
        })
      .then(res => {
        const tDep = res.data;
        this.setState({ tDep });
        console.log(tDep);
        console.log(moment(date).format('YYYY-MM-DD'));
      })
      .catch(function (error) {
        console.log(error);
      });
      
      axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/cashdeposit/getsaleswithdrawal', {
        params:{ 
            remittance_date: moment(date).format('YYYY-MM-DD')
            }
          })
        .then(res => {
          const tWith = res.data;
          this.setState({ tWith });
          console.log(tWith);
          console.log(moment(date).format('YYYY-MM-DD'));
        })
        .catch(function (error) {
          console.log(error);
        });  
  }

  handleChange (e) {
    // check it out: we get the evt.target.name (which will be either "email" or "password")
    // and use it to target the key on our `state` object with the same name, using bracket syntax
    this.setState({ [e.target.name]: e.target.value });
  }

  handledeptypeChange(e) {
    this.setState({transaction_detail_type: e.target.value});
  }

  handlebanktypeChange(e) {
    this.setState({aria_trans_gl_code: e.target.value});
  }

  onDismiss() {
    this.setState({ visible: false });
  }

  handleSubmit(e) {
    e.preventDefault();
    const Deposit = {
      id: this.props.data.id,
      bal: e.target.bal.value,
      amount: this.state.amount,
      memo: this.state.memo,
      transaction_date: this.state.salesDate,
      date_created: this.state.depositDate,
      transaction_detail_type: this.state.transaction_detail_type,
      aria_trans_gl_code: this.state.aria_trans_gl_code,
      toRedirect: false
    };

    var b = new Number(Deposit.bal);
    var a = new Number(Deposit.amount);
    console.log(b);
    console.log(a);

      console.log(Deposit);
      Swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      }).then((result) => {

        if (result.value) {
        axios.put('http://'+BACKENDIP+':'+BACKENDPORT+'/cashdeposit/updatedeposit', { 
        id: Deposit.id,
        bal: Deposit.bal,
        amount: Deposit.amount,
        memo: Deposit.memo,
        transaction_date: moment(this.state.salesDate).format('YYYY-MM-DD'),
        date_created: moment(this.state.depositDate).format('YYYY-MM-DD'),
        transaction_detail_type: Deposit.transaction_detail_type,
        aria_trans_gl_code: Deposit.aria_trans_gl_code
      })
      .then(res => {

        console.log(res);
        console.log(res.data);
        this.setState({ toRedirect:true });
        Swal(
          'Updated!',
          'Transaction has been updated.',
          'success'
        )
      
      })
    }
  })
    
  }
//==================================================
  getInitialState() {
      return {display: true };
   }
    

  handleDelete(Depositdata) {
    const Deposit = {
      id: Depositdata.id
    };

    Swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
      //console.log(Deposit);
      axios.delete('http://'+BACKENDIP+':'+BACKENDPORT+'/cashdeposit/deletedeposit', {
      data:{ 
          id: Deposit.id
        }
      })
      .then(res => {
        //console.log(res);
        //console.log(res.data);
        this.setState({ toRedirect:true });
        //console.log("deleted");
        Swal(
          'Deleted!',
          'Transaction has been deleted.',
          'success'
        )
      })
    }
    })



  }

  render() {
      console.log("table loaded");
 
      if (this.state.toRedirect === true) {
      return (
        <Switch>
         <Redirect to="/sales/Redirection"/>
        </Switch>
        );
    }
 
    
     return (

        <tr>
           <td>{this.props.data.branch_code}</td>
           <td>{this.props.data.id}</td>
           <td>{moment(this.props.data.date_created).format('L')}</td>
           <td>{moment(this.props.data.transaction_date).format('L')}</td>
           <td>{this.props.data.name}</td>
           <td><IntlProvider locale="en"><FormattedNumber value={this.props.data._net_amount}/></IntlProvider></td>
           <td>{this.props.data.memo_}</td>
           <td><Badge color="danger">UNRECONCILED</Badge></td>

          <td>
          <Row>
            <Col>
            <Button outline color="info" size="sm" onClick={this.openModal}><i className="fa fa-pencil-square-o"></i>&nbsp; Update</Button>
                  <Modal isOpen={this.state.large} toggle={this.openModal}
                         className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={this.openModal}>Cash Deposit</ModalHeader>
                    <ModalBody>
                    <Card>
                    <CardHeader>
                      <strong>Add New Deposit</strong>
                    </CardHeader>
                    <CardBody>
                      <Form onSubmit={this.handleSubmit}>
                      <Row>
                          <Col xs="6">
                          <FormGroup>
                          <Label htmlFor="salesDate">Sales Date:</Label>
                          <DatePicker selected={this.state.salesDate} onChange={this.handleSalesDateChange} maxDate={moment()} minDate={moment().subtract(5, "days")}/> 
                          </FormGroup>
                          </Col>
                          <Col xs="6">
                            {<h1>Transaction #: {this.state.idx}</h1>}
                            {this.state.tCash.map((tCash, i) => <h6 key = {i}>{ "Cash from Sales: "+tCash.cash}</h6>)}
                            {this.state.tDep.map((tDep, i) => <h6 key = {i}>{ "Deposited: "+tDep.cash}</h6>)}
                            {this.state.tWith.map((tWith, i) => <h6 key = {i}>{ "Withdrawal: "+tWith.cash}</h6>)}
                            {<h6>Total Balance: {this.state.tCash.map((tCash, i) => tCash.cash)-this.state.tDep.map((tDep, i) => tDep.cash)-this.state.tWith.map((tWith, i) => tWith.cash)}</h6>}
                          <FormGroup>
                          <Input type="hidden" id="bal" name="bal" value={this.state.tCash.map((tCash, i) => tCash.cash)-this.state.tDep.map((tDep, i) => tDep.cash)-this.state.tWith.map((tWith, i) => tWith.cash)} onChange={this.handleSalesDateChange}/>
                          </FormGroup>
                          </Col>
                      </Row>
                      <Row>
                          <Col xs="6">
                          <FormGroup>
                          <Label htmlFor="depositDate">Deposit Date:</Label>
                          <DatePicker selected={this.state.depositDate} onChange={this.handleDepositDateChange} maxDate={moment()} minDate={moment().subtract(5, "days")}/> 
                          </FormGroup>
                          </Col>
                      </Row>
                      <Row>
                          <Col xs="4">
                          <FormGroup>
                          <Label htmlFor="bankdropdown">Bank Account:</Label>
                          <Input type="select" name="aria_trans_gl_code" id="aria_trans_gl_code" value={this.state.aria_trans_gl_code} onChange={this.handlebanktypeChange}>
                          {this.state.Banks.map((Banks, i) => <option key={Banks.account_code} value={Banks.account_code}>{Banks.bank_account_name}</option>)}
                          </Input>
                          </FormGroup>
                          </Col>
                          <Col xs="4">
                            <FormGroup>
                            <Label htmlFor="transaction_detail_type">Type:</Label>
                            <Input type="select" name="transaction_detail_type" id="transaction_detail_type" value={this.state.transaction_detail_type} onChange={this.handledeptypeChange}>
                            {this.state.DepType.map((DepType, i) => <option key={DepType.id} value={DepType.id}>{DepType.name}</option>)}
                            </Input>
                            </FormGroup>
                          </Col>
                          </Row>
                        <FormGroup row>
                          <Col sm="8">
                          <Label htmlFor="amount">Amount:</Label>
                          <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismiss}>
                          The amount entered is greater than remaining balance!
                          </Alert>
                          <Input type="text" id="amount" name="amount" placeholder="Enter Amount.." value={this.state.amount} onChange={this.handleChange}/>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="file-input">Attach Deposit Slip:</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input type="file" id="depositslip" name="depositslip"/>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col xs="8">
                          <Label htmlFor="memo">Memo:</Label>
                          <Input type="textarea" name="memo" id="memo" rows="3" placeholder="Enter Memo..." value={this.state.memo} onChange={this.handleChange}/>
                          </Col>
                        </FormGroup>
                        <Button type="submit" size="sm" color="primary" ><i className="fa fa-dot-circle-o"></i> Submit</Button>
                        </Form>
                    </CardBody>
                    </Card>
                  <div>
                  <h1>{this.state.content}</h1>
                  </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="secondary" onClick={this.openModal}>Close</Button>
                    </ModalFooter>
                  </Modal>
            </Col>
          </Row>
          </td>

           <td><Button type="submit" outline color="danger" size="sm" onClick={() => this.handleDelete(this.props.data)}><i className="fa fa-trash-o"></i>&nbsp; Remove</Button></td>

        </tr>
     );
    }
  }

  class DepositDate extends React.PureComponent {
    constructor (props) {
      super(props)
      this.state = {
        Cash: [],
        startDate: moment()
      };
      this.handleChange = this.handleChange.bind(this);
    }
  
    handleChange(date) {
      this.setState({
        startDate: date
      });

      axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/cashdeposit/getsalescash')
      .then(res => {
        const Cash = res.data;
        this.setState({ Cash });
        console.log(Cash);
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    render() {
      console.log("date deposit loaded");
      return <DatePicker
          selected={this.state.startDate}
          onChange={this.handleChange}
      />;
    }
  }


  class DropdownBank extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
         Banks: []
      }
   }
  
   componentWillMount() {
    console.log("component did mount");
    axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/cashdeposit/bankdropdown')
      .then(res => {
        const Banks = res.data;
        this.setState({ Banks });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  
    render() {
      console.log("bank dropdown loaded");
      return (
        <div>
          <Label htmlFor="bankdropdown">Bank Account:</Label>
          <Input type="select" name="bankdropdown" id="bankdropdown">
          {this.state.Banks.map((Banks, i) => <option key={Banks.account_code}>{Banks.bank_account_name}</option>)}
          </Input>
        </div>
      )
    }
  }

export default withRouter(CashDeposit);