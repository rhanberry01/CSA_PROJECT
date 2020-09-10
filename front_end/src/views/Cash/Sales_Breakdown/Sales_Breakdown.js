import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import { BACKENDIP, BACKENDPORT } from '../../../Database';

import {
  Badge, Row, Col, Card, CardHeader, CardBody, Button,
  Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert, InputGroupText, InputGroup, InputGroupAddon
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { IntlProvider, FormattedNumber } from 'react-intl';
import Swal from 'sweetalert2';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { isNullOrUndefined } from 'util';
//BrowserRouter as Router,
import { Switch, Route, withRouter } from "react-router-dom";
import Spinner from 'react-spinkit';
//import Spinner from 'react-spinkit';
//import Loadable from 'react-loadable';
//import { ToastContainer,toast } from 'react-toastify';
//import SweetAlert from 'react-bootstrap-sweetalert';
//import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
//import { withRouter } from "react-router";
//import withReactContent from 'sweetalert2-react-content';

class SalesBreakdown extends React.Component {
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
      DepType: [],
      Banks: [],
      visiblealertGreater: false,
      visiblealertZero: false,
      alert: null,
      events: '',
      checker: false,
      aria_trans_gl_code: '10102299',
      transaction_detail_type: '201',
      loading: true,
    }

    this.openAddModal = this.openAddModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSalesDateChange = this.handleSalesDateChange.bind(this);
    this.handleDepositDateChange = this.handleDepositDateChange.bind(this);
    this.handledeptypeChange = this.handledeptypeChange.bind(this);
    this.handlebanktypeChange = this.handlebanktypeChange.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    this.handleAdd = this.handleAdd.bind(this);

  }
  /*
  //-----START OF TABLE PART
  loadDeposits() {
    axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/salesbreakdown/getdeposit')
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
  }
  */

  closeModal() {
    this.setState({
      large: !this.state.large,
    });
  }

  //----START OF ADD PART
  openAddModal() {
    //console.log("clicked.");
    this.setState({
      large: !this.state.large
    });

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/salesbreakdown/deposittypedropdown')
      .then(res => {
        const DepType = res.data;
        this.setState({ DepType });
      })
      .catch(function (error) {
        console.log(error);
      });

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/salesbreakdown/bankdropdown')
      .then(res => {
        const Banks = res.data;
        this.setState({ Banks });
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  handleDepositDateChange(date) {
    this.setState({
      depositDate: date
    });
  }

  handleSalesDateChange(date) {
    this.setState({
      salesDate: date
    });

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/salesbreakdown/getsalescash', {
      params: {
        remittance_date: moment(date).format('YYYY-MM-DD')
      }
    })
      .then(res => {
        const tCash = res.data;
        this.setState({ tCash });
        //console.log(tCash);
        //console.log(moment(date).format('YYYY-MM-DD'));
      })
      .catch(function (error) {
        console.log(error);
      });

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/salesbreakdown/getsalesdeposited', {
      params: {
        remittance_date: moment(date).format('YYYY-MM-DD')
      }
    })
      .then(res => {
        const tDep = res.data;
        this.setState({ tDep });
        //console.log(tDep);
        //console.log(moment(date).format('YYYY-MM-DD'));
      })
      .catch(function (error) {
        console.log(error);
      });

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/salesbreakdown/getsaleswithdrawal', {
      params: {
        remittance_date: moment(date).format('YYYY-MM-DD')
      }
    })
      .then(res => {
        const tWith = res.data;
        this.setState({ tWith });
        //console.log(tWith);
        //console.log(moment(date).format('YYYY-MM-DD'));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleChange(e) {
    // check it out: we get the evt.target.name (which will be either "email" or "password")
    // and use it to target the key on our `state` object with the same name, using bracket syntax
    this.setState({ [e.target.name]: e.target.value });
    //console.log(this.state.value);
  }

  handledeptypeChange(e) {
    this.setState({ transaction_detail_type: e.target.value });
  }

  handlebanktypeChange(e) {
    this.setState({ aria_trans_gl_code: e.target.value });
  }

  hideAlert() {
    //console.log('Cancelled.');
    this.setState({
      alert: null
    });
  }

  handleAdd(e) {
    //const MySwal = withReactContent(Swal)
    //console.log(e); 
    e.preventDefault();
    e.persist(); //to remove synthetic event

    //START of Validation
    if (this.state.amount <= 0) {

      Swal({
        type: 'error',
        title: 'Oops...',
        text: 'zero, negative and empty amount is not accepted.',
      })
      //console.log("invalid");
      //alert("invalid");
      this.setState({ visiblealertZero: true });
      return;
    }
    //END of Validation

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

        //console.log('true.');
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
        //console.log(b);
        //console.log(a);

        if (Number(a) > Number(b)) {
          Swal({
            type: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          })
          //console.log("invalid");
          //alert("invalid");
          this.setState({ visiblealertGreater: true });
        } else {
          //console.log(Deposit);
          axios.defaults.withCredentials = true;
          axios.post('http://' + BACKENDIP + ':' + BACKENDPORT + '/salesbreakdown/adddeposit', {
            bal: Deposit.bal,
            amount: Deposit.amount,
            memo: Deposit.memo,
            transaction_date: moment(this.state.salesDate).format('YYYY-MM-DD'),
            deposit_date: moment(this.state.depositDate).format('YYYY-MM-DD'),
            date_created: moment().format('YYYY-MM-DD'),
            transaction_detail_type: Deposit.transaction_detail_type,
            aria_trans_gl_code: Deposit.aria_trans_gl_code
          })
            .then(res => {

              //console.log(res);
              //console.log(res.data);
              Swal.fire({
                position: 'center',
                type: 'success',
                title: 'Transaction has been added.',
                showConfirmButton: false,
                timer: 2000
              })
              /*
               Swal(
                 'Successful!',
                 'Your deposit has been Added.',
                 'success'
               );
               */
              // this.props.history.push("/sales/sales_audit")
              this.setState({ toRedirect: true });
            })
        }
      }
    })
  }

  render() {
    if (this.state.toRedirect === true) {
      //console.log("go1");
      return (
        <Switch>
          <Route path="/cash/cash_deposit" component={SalesBreakdown} />
        </Switch>
      );
    }
    else {
      //console.log("go2");
      var notifyZero = "Zero, empty and negative amount are invalid!";
      var notifyGreater = "The amount entered is greater than remaining balance!";
      return (
        <div className="animated fadeIn">
          <Row>
            <Col>
              <Modal isOpen={this.state.large} toggle={this.openAddModal}
                className={'modal-success ' + this.props.className} backdrop="static">
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
                              <DatePicker selected={this.state.salesDate} onChange={this.handleSalesDateChange} maxDate={moment()} minDate={moment().subtract(5, "days")} />
                            </FormGroup>
                          </Col>
                          <Col xs="6">
                            {this.state.tCash.map((tCash, i) => <h6 key={i}>{"Cash from Sales: " + tCash.cash}</h6>)}
                            {this.state.tDep.map((tDep, i) => <h6 key={i}>{"Deposited: " + tDep.cash}</h6>)}
                            {this.state.tWith.map((tWith, i) => <h6 key={i}>{"Withdrawal: " + tWith.cash}</h6>)}
                            {<h6>Total Balance: {this.state.tCash.map((tCash, i) => tCash.cash) - this.state.tDep.map((tDep, i) => tDep.cash) - this.state.tWith.map((tWith, i) => tWith.cash)}</h6>}
                            <FormGroup>
                              <Input type="hidden" id="bal" name="bal" value={this.state.tCash.map((tCash, i) => tCash.cash) - this.state.tDep.map((tDep, i) => tDep.cash) - this.state.tWith.map((tWith, i) => tWith.cash)} onChange={this.handleSalesDateChange} />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs="6">
                            <FormGroup>
                              <Label htmlFor="depositDate">Deposit Date:</Label>
                              <DatePicker selected={this.state.depositDate} onChange={this.handleDepositDateChange} maxDate={moment()} minDate={moment().subtract(5, "days")} />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs="6">
                            <FormGroup>
                              <Label htmlFor="bankdropdown">Bank Account:</Label>
                              <Input type="select" name="aria_trans_gl_code" id="aria_trans_gl_code" value={this.state.aria_trans_gl_code} onChange={this.handlebanktypeChange}>
                                {this.state.Banks.map((Banks, i) => <option key={Banks.account_code} value={Banks.account_code}>{Banks.bank_account_name}</option>)}
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col xs="6">
                            <FormGroup>
                              <Label htmlFor="transaction_detail_type">Type:</Label>
                              <Input type="select" name="transaction_detail_type" id="transaction_detail_type" value={this.state.transaction_detail_type} onChange={this.handledeptypeChange}>
                                {this.state.DepType.map((DepType, i) => <option key={DepType.type} value={DepType.type}>{DepType.name}</option>)}
                              </Input>
                            </FormGroup>
                          </Col>
                        </Row>
                        <FormGroup row>
                          <Col sm="8">
                            <Label htmlFor="amount">Amount:</Label>
                            <Alert color="danger" isOpen={this.state.visiblealertZero}>
                              {notifyZero}
                            </Alert>
                            <Alert color="danger" isOpen={this.state.visiblealertGreater}>
                              {notifyGreater}
                            </Alert>
                            <Input type="number" id="amount" name="amount" placeholder="Enter Amount.." value={this.state.amount} onChange={this.handleChange} />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="file-input">Attach Deposit Slip:</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input type="file" id="depositslip" name="depositslip" />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col xs="8">
                            <Label htmlFor="memo">Memo:</Label>
                            <Input type="textarea" name="memo" id="memo" rows="3" placeholder="Enter Memo..." value={this.state.memo} onChange={this.handleChange} />
                          </Col>
                        </FormGroup>
                        <Row>
                          <Col xs="10">
                            <Button type="submit" size="sm" color="primary" aria-hidden="true" ><i className="fa fa-dot-circle-o"></i> Submit</Button>
                          </Col>
                          <Col xs="-2">
                            <Button color="secondary" onClick={this.closeModal}>Close</Button>
                          </Col>
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                </ModalBody>
              </Modal>
            </Col>
          </Row>
          <div>
            <Row>
              <Col>
                <Card>
                  <CardHeader>
                    <i className="fa fa-shopping-cart"></i> Sales Breakdown
                {/*<Button color="success" className="float-right" onClick={this.openAddModal}><i className="fa fa-plus-square"></i>&nbsp; Record Cash Deposit</Button>*/}
                  </CardHeader>
                  <CardBody>
                    <Pagis />
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

class Pagis extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      Deposits: [],
      id: '',
      large: false,
      bal: '',
      tCash: [],
      tDep: [],
      tWith: [],
      DepType: [],
      Banks: [],
      toRedirect: false,
      idx: '',
      amount: '',
      dateFrom: moment(),
      dateTo: moment(),
      aria_trans_gl_code: '10102299',
      transaction_detail_type: '201',
      visiblealertZero: false,
      visiblealertGreater: false,
      loading: true,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSalesDateChange = this.handleSalesDateChange.bind(this);
    this.handleDepositDateChange = this.handleDepositDateChange.bind(this);
    this.handledeptypeChange = this.handledeptypeChange.bind(this);
    this.handlebanktypeChange = this.handlebanktypeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDateFromChange = this.handleDateFromChange.bind(this);
    this.handleDateToChange = this.handleDateToChange.bind(this);
    this.handleChangestatusType = this.handleChangestatusType.bind(this);
  }

  componentDidMount() {
    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/salesbreakdown/getbreakdown', {
      params: {
        date_from: this.state.dateFrom.subtract(30, 'days').format('YYYY-MM-DD'),
        date_to: this.state.dateTo.format('YYYY-MM-DD'),
      }
    })
      .then(res => {
        const Deposits = res.data;
        this.setState({ Deposits, loading: false });
        console.log(Deposits);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleSearch(date) {

    /*
    this.setState({
      date_from: this.state.dateFrom,
      date_to: this.state.dateTo,
      status_type: this.state.statusType,
    });
    */

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/salesbreakdown/getselectedbreakdown', {
      params: {
        date_from: moment(this.state.dateFrom).format('YYYY-MM-DD'),
        date_to: moment(this.state.dateTo).format('YYYY-MM-DD'),
        status_type: this.state.statusType,
      }
    })
      .then(res => {
        const Deposits = res.data;
        this.setState({ Deposits, loading: false });
        console.log(JSON.stringify(Deposits));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  closeModal() {
    this.setState({
      large: !this.state.large,
    });
  }

  openModal(Depositdata) {
    this.setState({
      large: !this.state.large,
      idx: Depositdata.id,
      amount: Depositdata._net_amount,
      memo: Depositdata.memo_,
      salesDate: moment(Depositdata.transaction_date),
      depositDate: moment(Depositdata.deposit_date),
      aria_trans_gl_code: Depositdata.aria_trans_gl_code,
      transaction_detail_type: Depositdata.transaction_type,
    });

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/salesbreakdown/getsalescash', {
      params: {
        remittance_date: moment(Depositdata.transaction_date).format('YYYY-MM-DD')
      }
    })
      .then(res => {
        const tCash = res.data;
        this.setState({ tCash });
        //console.log(tCash);
        //console.log(moment(Depositdata.transaction_date).format('YYYY-MM-DD'));
      })
      .catch(function (error) {
        console.log(error);
      });

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/salesbreakdown/getsalesdeposited', {
      params: {
        remittance_date: moment(Depositdata.transaction_date).format('YYYY-MM-DD')
      }
    })
      .then(res => {
        const tDep = res.data;
        this.setState({ tDep });
        //console.log(tDep);
        //console.log(moment(Depositdata.transaction_date).format('YYYY-MM-DD'));
      })
      .catch(function (error) {
        console.log(error);
      });

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/salesbreakdown/getsaleswithdrawal', {
      params: {
        remittance_date: moment(Depositdata.transaction_date).format('YYYY-MM-DD')
      }
    })
      .then(res => {
        const tWith = res.data;
        this.setState({ tWith });
        //console.log(tWith);
        //console.log(moment(Depositdata.transaction_date).format('YYYY-MM-DD'));
      })
      .catch(function (error) {
        console.log(error);
      });

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/salesbreakdown/deposittypedropdown')
      .then(res => {
        const DepType = res.data;
        this.setState({ DepType });
      })
      .catch(function (error) {
        console.log(error);
      });

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/salesbreakdown/bankdropdown')
      .then(res => {
        const Banks = res.data;
        this.setState({ Banks });
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  handleDateFromChange(date) {
    this.setState({
      dateFrom: date
    });
  }

  handleDateToChange(date) {
    this.setState({
      dateTo: date
    });
  }

  handleChangestatusType(e) {
    this.setState({
      statusType: e.target.value
    });
  }

  handleDepositDateChange(date) {
    this.setState({
      depositDate: date
    });
  }

  handleSalesDateChange(date) {
    this.setState({
      salesDate: date
    });
  }

  handleChange(e) {
    // check it out: we get the evt.target.name (which will be either "email" or "password")
    // and use it to target the key on our `state` object with the same name, using bracket syntax
    this.setState({ [e.target.name]: e.target.value });
  }

  handledeptypeChange(e) {
    this.setState({ transaction_detail_type: e.target.value });
  }

  handlebanktypeChange(e) {
    this.setState({ aria_trans_gl_code: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const Deposit = {
      id: this.state.idx,
      bal: e.target.bal.value,
      amount: this.state.amount,
      memo: this.state.memo,
      transaction_date: this.state.salesDate,
      deposit_date: this.state.depositDate,
      transaction_detail_type: this.state.transaction_detail_type,
      aria_trans_gl_code: this.state.aria_trans_gl_code,
      toRedirect: false
    };

    var b = new Number(Deposit.bal);
    var a = new Number(Deposit.amount);
    //console.log(b);
    //console.log(a);

    if (Number(a) > Number(b)) {
      Swal({
        type: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      })
      //console.log("invalid");
      //alert("invalid");
      this.setState({ visiblealertGreater: true });
      return;
    }

    //console.log(Deposit);
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
        axios.put('http://' + BACKENDIP + ':' + BACKENDPORT + '/salesbreakdown/updatedeposit', {
          id: Deposit.id,
          bal: Deposit.bal,
          amount: Deposit.amount,
          memo: Deposit.memo,
          transaction_date: moment(this.state.salesDate).format('YYYY-MM-DD'),
          deposit_date: moment(this.state.depositDate).format('YYYY-MM-DD'),
          transaction_detail_type: Deposit.transaction_detail_type,
          aria_trans_gl_code: Deposit.aria_trans_gl_code
        })
          .then(res => {

            //console.log(res);
            //console.log(res.data);
            this.setState({ toRedirect: true });
            Swal.fire({
              position: 'center',
              type: 'success',
              title: 'Transaction has been updated.',
              showConfirmButton: false,
              timer: 2000
            })
            /*
            Swal(
              'Updated!',
              'Transaction has been updated.',
              'success'
            )
            */

          })
      }
    })

  }
  //-----------------------------------------------
  getInitialState() {
    return { display: true };
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
        axios.delete('http://' + BACKENDIP + ':' + BACKENDPORT + '/salesbreakdown/deletedeposit', {
          data: {
            id: Deposit.id
          }
        })
          .then(res => {
            //console.log(res);
            //console.log(res.data);
            this.setState({ toRedirect: true });
            //console.log("deleted");
            Swal.fire({
              position: 'center',
              type: 'success',
              title: 'Transaction has been deleted.',
              showConfirmButton: false,
              timer: 2000
            })
            /*
            Swal(
              'Deleted!',
              'Transaction has been deleted.',
              'success'
            )
            */
          })
      }
    })
  }

  render() {
    //console.log(this.state.idx);
    const customTotal = (from, to, size) => (
      <span className="react-bootstrap-table-pagination-total">
        Showing { from} to { to} of { size} Results
      </span>
    );

    const options = {
      paginationSize: 4,
      pageStartIndex: 1,
      // alwaysShowAllBtns: true, // Always show next and previous button
      // withFirstAndLast: false, // Hide the going to First and Last page button
      // hideSizePerPage: true, // Hide the sizePerPage dropdown always
      // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
      firstPageText: 'First',
      prePageText: 'Back',
      nextPageText: 'Next',
      lastPageText: 'Last',
      nextPageTitle: 'First page',
      prePageTitle: 'Pre page',
      firstPageTitle: 'Next page',
      lastPageTitle: 'Last page',
      showTotal: true,
      paginationTotalRenderer: customTotal,
      sizePerPageList: [{
        text: '5', value: 5
      }, {
        text: '10', value: 10
      }
        //, 
        //{
        //   text: 'All', value: products.length
        // }
      ] // A numeric array is also available. the purpose of above example is custom the text
    };

    function dateFormatter(cell, row) {
      return (
        <span>
          {moment(cell).format('L')}
        </span>
      );
    }

    function amountFormatter(cell, row) {
      //console.log(cell);
      if (isNullOrUndefined(cell)) {
        cell = 0;
      }
      return (
        <span>
          <IntlProvider locale="en"><FormattedNumber value={cell} /></IntlProvider>
        </span>
      );
    }

    const { SearchBar } = Search;
    const { ExportCSVButton } = CSVExport;

    const products = this.state.Deposits;
    //start of sorting
    const headerSortingStyle = { backgroundColor: '#428aff' };
    const columns = [
      {
        dataField: 'ts_date_remit',
        text: 'Sales Date',
        sort: true,
        headerSortingStyle,
        formatter: dateFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: "Total : "

      },
      {
        dataField: 'ts_sales',
        text: 'Sales',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)

      },
      {
        dataField: 'ts_cash',
        text: 'Cash',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: 'ts_srsgc',
        text: 'SRSGC',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: 'ts_gc',
        text: 'GC',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: 'ts_terms',
        text: 'Terms',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: 'ts_e_voucher',
        text: 'Voucher',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: 'ts_ricepromo',
        text: 'RicePromo',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: 'ts_ddkita',
        text: 'DagdagKita',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: 'ts_suki',
        text: 'SukiPoints',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: 'ts_check',
        text: 'Check',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: 'ts_debit',
        text: 'Debit',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: 'ts_atd',
        text: 'ATD',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: 'ts_receivable_cus',
        text: 'CusRec',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: 'ts_receivable_sup',
        text: 'SupRec',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: 'ts_cwtax',
        text: 'cwTax',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: 'ts_short',
        text: 'Short',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: 'ts_over',
        text: 'Over',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: 'withtotal',
        text: 'Withdrawal',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: 'deptotal',
        text: 'Deposited',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: 'balance',
        isDummyField: true,
        text: 'Balance',
        sort: true,
        headerSortingStyle,

        formatter: (products, row) => {
          var balance = row.ts_cash - row.withtotal - row.deptotal;
          return (
            <IntlProvider locale="en"><FormattedNumber value={Math.abs(balance)} /></IntlProvider>
          );

        },

        headerStyle: { backgroundColor: '#84b3ff' },
        footer: ""
      },
      {
        dataField: 'balancex',
        isDummyField: true,
        text: 'Status',
        sort: true,
        headerSortingStyle,

        formatter: (products, row) => {
          var balancex = row.ts_cash - row.withtotal - row.deptotal;
          if (Math.abs(Math.round(balancex)) == 0) {
            return (
              <span>
                <span><Badge color="success">COMPLETED</Badge></span>
              </span>
            );
          }
          else {
            return (
              <span>
                <span><Badge color="danger">INCOMPLETE</Badge></span>
              </span>
            );
          }

        },

        headerStyle: { backgroundColor: '#84b3ff' },
        footer: ""
      },
      /*
      {
          dataField: 'Update',
          text: 'Update',
          formatter: (cellContent, row) => (
            <Button outline color="info" size="sm" onClick={() => this.openModal(row)}><i className="fa fa-pencil-square-o"></i>&nbsp; Update</Button>
          )
    }, 
    {
          dataField: 'Delete',
          text: 'Delete',
          formatter: (cellContent, row) => (
              <Button type="submit" outline color="danger" size="sm" onClick={() => this.handleDelete(row)}><i className="fa fa-trash-o"></i>&nbsp; Remove</Button>
          )
    }
    */
    ];
    //<Button type="submit" outline color="danger" size="sm" onClick={() => this.handleDelete(row.id)}><i className="fa fa-trash-o"></i>&nbsp; Remove</Button>

    const defaultSorted = [{
      dataField: 'ts_date_remit',
      order: 'desc'
    }];

    if (this.state.toRedirect === true) {
      //console.log("go3");
      return (
        <Switch>
          <Route path="/cash/cash_deposit" component={Pagis} />
        </Switch>
      );
    }
    var notifyZero = "Zero, empty and negative amount are invalid!";
    var notifyGreater = "The amount entered is greater than remaining balance!";

    //loading sign
    if (this.state.loading == true) {
      var loader = <h6><Spinner name="ball-beat" color="steelblue" />Now Loading...</h6>;
    }
    else {
      var loader = '';
    }

    return (
      <div>
        <Modal isOpen={this.state.large} toggle={this.openModal} className={'modal-info ' + this.props.className} backdrop="static">
          <ModalHeader toggle={this.openModal}>Cash Deposit</ModalHeader>
          <ModalBody>
            <Card>
              <CardHeader>
                <strong>Update Deposit</strong>
              </CardHeader>
              <CardBody>
                <Form onSubmit={this.handleSubmit}>
                  <Row>
                    <Col xs="6">
                      <FormGroup>
                        <Label htmlFor="salesDate">Sales Date:</Label>
                        <DatePicker selected={this.state.salesDate} onChange={this.handleSalesDateChange} maxDate={moment()} minDate={moment().subtract(5, "days")} disabled={true} />
                      </FormGroup>
                    </Col>
                    <Col xs="6">
                      {<h6>Transaction #: {this.state.idx}</h6>}
                      {this.state.tCash.map((tCash, i) => <h6 key={i}>{"Cash from Sales: " + tCash.cash}</h6>)}
                      {this.state.tDep.map((tDep, i) => <h6 key={i}>{"Deposited: " + tDep.cash}</h6>)}
                      {this.state.tWith.map((tWith, i) => <h6 key={i}>{"Withdrawal: " + tWith.cash}</h6>)}
                      {<h6>Total Balance: {this.state.tCash.map((tCash, i) => tCash.cash) - this.state.tDep.map((tDep, i) => tDep.cash) - this.state.tWith.map((tWith, i) => tWith.cash)}</h6>}
                      <FormGroup>
                        <Input type="hidden" id="bal" name="bal" value={this.state.tCash.map((tCash, i) => tCash.cash) - this.state.tDep.map((tDep, i) => tDep.cash) - this.state.tWith.map((tWith, i) => tWith.cash)} onChange={this.handleSalesDateChange} />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="6">
                      <FormGroup>
                        <Label htmlFor="depositDate">Deposit Date:</Label>
                        <DatePicker selected={this.state.depositDate} onChange={this.handleDepositDateChange} maxDate={moment()} minDate={moment().subtract(5, "days")} />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="6">
                      <FormGroup>
                        <Label htmlFor="bankdropdown">Bank Account:</Label>
                        <Input type="select" name="aria_trans_gl_code" id="aria_trans_gl_code" value={this.state.aria_trans_gl_code} onChange={this.handlebanktypeChange}>
                          {this.state.Banks.map((Banks, i) => <option key={Banks.account_code} value={Banks.account_code}>{Banks.bank_account_name}</option>)}
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col xs="6">
                      <FormGroup>
                        <Label htmlFor="transaction_detail_type">Type:</Label>
                        <Input type="select" name="transaction_detail_type" id="transaction_detail_type" value={this.state.transaction_detail_type} onChange={this.handledeptypeChange}>
                          {this.state.DepType.map((DepType, i) => <option key={DepType.type} value={DepType.type}>{DepType.name}</option>)}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup row>
                    <Col sm="8">
                      <Label htmlFor="amount">Amount:</Label>
                      <Alert color="danger" isOpen={this.state.visiblealertZero}>
                        {notifyZero}
                      </Alert>
                      <Alert color="danger" isOpen={this.state.visiblealertGreater}>
                        {notifyGreater}
                      </Alert>
                      <Input type="number" id="amount" name="amount" placeholder="Enter Amount.." value={this.state.amount} onChange={this.handleChange} />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="file-input">Attach Deposit Slip:</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="file" id="depositslip" name="depositslip" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col xs="8">
                      <Label htmlFor="memo">Memo:</Label>
                      <Input type="textarea" name="memo" id="memo" rows="3" placeholder="Enter Memo..." value={this.state.memo} onChange={this.handleChange} />
                    </Col>
                  </FormGroup>

                  <Row>
                    <Col xs="10">
                      <Button type="submit" size="sm" color="primary" ><i className="fa fa-dot-circle-o"></i> Update</Button>
                    </Col>
                    <Col xs="-2">
                      <Button color="secondary" onClick={this.closeModal}>Close</Button>
                    </Col>
                  </Row>

                </Form>
              </CardBody>
            </Card>
          </ModalBody>
        </Modal>

        {/* START OF TABLE ToolkitProvider*/}
        <ToolkitProvider
          keyField="ts_id"
          data={products}
          columns={columns}
          search
          exportCSV={{
            fileName: 'SalesBreakdown.csv'
          }}
        >
          {
            props => (
              <div>

                {/* START OF FILTER */}
                <Row>
                  <Col>
                    <Label htmlFor="depositDate">From Sales Date:</Label>
                    <DatePicker selected={this.state.dateFrom} onChange={this.handleDateFromChange} maxDate={moment()} />
                  </Col>
                  <Col>
                    <Label htmlFor="depositDate">To Sales Date:</Label>
                    <DatePicker selected={this.state.dateTo} onChange={this.handleDateToChange} maxDate={moment()} />
                  </Col>
                  <Col>
                    <Label htmlFor="statusType">Status:</Label>
                    <Input type="select" name="statusType" id="statusType" value={this.state.statusType} onChange={this.handleChangestatusType}>
                      <option value="0">ALL</option>
                      <option value="1">Incomplete</option>
                      <option value="2">Complete</option>
                    </Input>
                  </Col>
                  <Col>
                    <br />
                    <Button color="secondary" className="float-left" onClick={() => this.handleSearch()}><i className="fa fa-filter"></i>&nbsp; Filter</Button>
                  </Col>
                </Row>
                <hr />
                {/* END OF FILTER */}


                {/* START OF SEARCH */}
                {
                  /* 
                  <Col sm="6">
                  <Button color="success" className="float-left" onClick={this.openAddModal}><i className="fa fa-plus-square"></i>&nbsp; Record Cash Withdrawal</Button>
                  </Col>
                  */
                }
                <Row>
                  <Col sm="6">
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-search"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <SearchBar {...props.searchProps} placeholder="Find what...?" />
                    </InputGroup>
                  </Col>
                </Row>
                {/* END OF SEARCH */}

                {/* START OF TABLE*/}
                {loader}
                <BootstrapTable
                  bootstrap4

                  {...props.baseProps}
                  striped
                  hover
                  //filter={ filterFactory() }
                  defaultSorted={defaultSorted}
                  //search
                  pagination={paginationFactory(options)}
                />

                <hr />
                <ExportCSVButton {...props.csvProps}>Export to CSV</ExportCSVButton>
                {/* END OF TABLE*/}

              </div>
            )

          }
        </ToolkitProvider>   {/* END OF TABLE ToolkitProvider*/}

      </div>
    )
  }
}

export default withRouter(SalesBreakdown);