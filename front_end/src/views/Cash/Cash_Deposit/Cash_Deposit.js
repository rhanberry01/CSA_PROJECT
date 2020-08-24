import React, { Component } from 'react';
import { render, findDOMNode } from 'react-dom';
import axios from 'axios';
import { BACKENDIP, BACKENDPORT } from '../../../Database';

import {
  Badge, Row, Col, Card, CardHeader, CardBody, Button,
  Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert, InputGroupText, InputGroup, InputGroupAddon
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { IntlProvider, FormattedMessage, FormattedNumber } from 'react-intl';
import Spinner from 'react-spinkit';
import Loadable from 'react-loadable';
import { ToastContainer, toast } from 'react-toastify';
import SweetAlert from 'react-bootstrap-sweetalert';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
//BrowserRouter as Router,
import { Link, Switch, Route, withRouter } from "react-router-dom";
//import { withRouter } from "react-router";

import FormData, { getHeaders } from 'form-data';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

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
      upd: '',
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
      file: null,
      loading: true,
      isOpenimage: false,
      photoIndex: 0,
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
    this.handlefileChange = this.handlefileChange.bind(this);

  }
  /*
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

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashdeposit/deposittypedropdown')
      .then(res => {
        const DepType = res.data;
        this.setState({ DepType });
      })
      .catch(function (error) {
        console.log(error);
      });

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashdeposit/bankdropdown')
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

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashdeposit/getsalescash', {
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

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashdeposit/getsalesdeposited', {
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

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashdeposit/getsaleswithdrawal', {
      params: {
        remittance_date: moment(date).format('YYYY-MM-DD')
      }
    })
      .then(res => {
        const tWith = res.data;
        this.setState({ tWith });
        //console.log(tWith);
        // console.log(moment(date).format('YYYY-MM-DD'));
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

  handlefileChange(e) {
    console.log(e.target.files[0]);
    this.setState({ file: e.target.files[0] });

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
          upd: e.target.upd.value,
          amount: this.state.amount,
          memo: this.state.memo,
          transaction_date: this.state.salesDate,
          date_created: this.state.depositDate,
          transaction_detail_type: this.state.transaction_detail_type,
          aria_trans_gl_code: this.state.aria_trans_gl_code,
          image_file: this.state.file,
        };

        //var b = new Number(Math.round(Deposit.bal, 2));
        // var a = new Number(Math.round(Deposit.amount, 2));
        console.log(this.state.file + "file");

        var a = new Number(Deposit.amount).toFixed(2);
        var b = new Number(Deposit.bal).toFixed(2);
        //console.log(b);
        // console.log(Deposit.upd + 'uuppppp');

        if (Number(a) > Number(b)) {
          Swal({
            type: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          })
          //console.log("invalid");
          //alert("invalid");
          this.setState({ visiblealertGreater: true });
        }
        else {
          const formData = new FormData();
          formData.append('myImage', this.state.file);
          formData.append('bal', Deposit.bal);
          formData.append('amount', Deposit.amount);
          formData.append('memo', Deposit.memo);
          formData.append('transaction_date', moment(this.state.salesDate).format('YYYY-MM-DD'));
          formData.append('date_deposited', moment(this.state.depositDate).format('YYYY-MM-DD'));
          formData.append('date_created', moment().format('YYYY-MM-DD'));
          formData.append('transaction_detail_type', Deposit.transaction_detail_type);
          formData.append('aria_trans_gl_code', Deposit.aria_trans_gl_code);

          const config = {
            headers: {
              'content-type': 'multipart/form-data',
            }
          };
          axios.post('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashdeposit/adddeposit3', formData, config)
            .then(res => {
              Swal.fire({
                position: 'center',
                type: 'success',
                title: 'Transaction has been Added.',
                showConfirmButton: false,
                timer: 2000
              })

              this.setState({ toRedirect: true });
            })
        }












        /*
         else {
          console.log(Deposit);
          axios.post('http://'+BACKENDIP+':'+BACKENDPORT+'/cashdeposit/adddeposit', { 
            bal: Deposit.bal,
            amount: Deposit.amount,
            memo: Deposit.memo,
            transaction_date: moment(this.state.salesDate).format('YYYY-MM-DD'),
            date_created: moment().format('YYYY-MM-DD'),
            date_deposited: moment(this.state.depositDate).format('YYYY-MM-DD'),
            transaction_detail_type: Deposit.transaction_detail_type,
            aria_trans_gl_code: Deposit.aria_trans_gl_code
          })
          .then(res => {
             Swal.fire({
              position: 'center',
              type: 'success',
              title: 'Transaction has been Added.',
              showConfirmButton: false,
              timer: 2000
            })
            this.setState({ toRedirect:true });
           })
         }
         */

      }
    })
  }

  render() {
    if (this.state.toRedirect === true) {
      //console.log("go1");
      return (
        <Switch>
          <Route path="/cash/cash_deposit" component={CashDeposit} />
        </Switch>
      );
    }
    else {
      //console.log("go2");
      var notifyZero = "Zero, empty and negative amount are invalid!";
      var notifyGreater = "The amount entered is greater than remaining balance!";

      const totalcashsales = this.state.tCash.map((tCash, i) => tCash.cash);
      const totaldeposited = this.state.tDep.map((tDep, i) => tDep.cash);
      const totalwithdrawal = this.state.tWith.map((tWith, i) => tWith.cash);
      const totalbalance = totalcashsales - totaldeposited - totalwithdrawal;
      var thisYear = (new Date()).getFullYear();
      var start = new Date("1/1/" + thisYear);
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
                              { /*<DatePicker selected={this.state.salesDate} onChange={this.handleSalesDateChange} maxDate={moment()} minDate={moment().subtract(15, "days")} /> */}

                              <DatePicker selected={this.state.salesDate} onChange={this.handleSalesDateChange} minDate={moment(start.valueOf())} />
                            </FormGroup>
                          </Col>
                          <Col xs="6">
                            <h6>Cash from Sales: <IntlProvider locale="en">
                              <FormattedNumber value={totalcashsales} />
                            </IntlProvider>
                            </h6>
                            <h6>Deposited: <IntlProvider locale="en">
                              <FormattedNumber value={totaldeposited} />
                            </IntlProvider>
                            </h6>
                            <h6>Withdrawal: <IntlProvider locale="en">
                              <FormattedNumber value={totalwithdrawal} />
                            </IntlProvider>
                            </h6>
                            <h6>Balance: <IntlProvider locale="en">
                              <FormattedNumber value={totalbalance} />
                            </IntlProvider>
                            </h6>
                            <FormGroup>
                              <Input type="hidden" id="bal" name="bal" value={totalbalance} onChange={this.handleSalesDateChange} />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs="6">
                            <FormGroup>
                              <Label htmlFor="depositDate">Deposit Date:</Label>
                              {/*<DatePicker selected={this.state.depositDate} onChange={this.handleDepositDateChange} maxDate={moment()} minDate={moment().subtract(15, "days")}/> */}
                              <DatePicker selected={this.state.depositDate} onChange={this.handleDepositDateChange} />
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
                            <input type="file" name="myImage" onChange={this.handlefileChange} />
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
                    <i className="fa fa-shopping-cart"></i> Sales Deposit
                <Button color="success" className="float-right" onClick={this.openAddModal}><i className="fa fa-plus-square"></i>&nbsp; Record Cash Deposit</Button>
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

class DepositDate extends React.PureComponent {
  constructor(props) {
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

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashdeposit/getsalescash')
      .then(res => {
        const Cash = res.data;
        this.setState({ Cash });
        //console.log(Cash);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    //console.log("date deposit loaded");
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
    //console.log("component did mount");
    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashdeposit/bankdropdown')
      .then(res => {
        const Banks = res.data;
        this.setState({ Banks });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    //console.log("bank dropdown loaded");
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
      isOpenimage: false,
      photoIndex: 0,
      imgfilename: '',
      imgcaption: '',
      file: null,
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
    this.viewImage = this.viewImage.bind(this);
    this.handlefileChange = this.handlefileChange.bind(this);
  }



  viewImage(Depositdata) {
    //console.log('test');
    this.setState({ isOpenimage: true, imgfilename: Depositdata.attachment_name, imgcaption: Depositdata.id });
  }

  componentDidMount() {
    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashdeposit/getdeposit', {
      params: {
        date_from: this.state.dateFrom.subtract(30, 'days').format('YYYY-MM-DD'),
        date_to: this.state.dateTo.format('YYYY-MM-DD'),
      }
    })
      .then(res => {
        const Deposits = res.data;
        this.setState({ Deposits, loading: false });
        //console.log(Deposits);
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

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashdeposit/getfilterdeposit', {
      params: {
        date_from: moment(this.state.dateFrom).format('YYYY-MM-DD'),
        date_to: moment(this.state.dateTo).format('YYYY-MM-DD'),
        status_type: this.state.statusType,
      }
    })
      .then(res => {
        const Deposits = res.data;
        this.setState({ Deposits, loading: false });
        //console.log("x");
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

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashdeposit/getsalescash', {
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

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashdeposit/getsalesdeposited', {
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

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashdeposit/getsaleswithdrawal', {
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

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashdeposit/deposittypedropdown')
      .then(res => {
        const DepType = res.data;
        this.setState({ DepType });
      })
      .catch(function (error) {
        console.log(error);
      });

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashdeposit/bankdropdown')
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

  handlefileChange(e) {
    // console.log(e.target.files[0]);
    this.setState({ file: e.target.files[0] });

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
      image_file: this.state.file,
      toRedirect: false
    };

    // var b = new Number(Math.round(Deposit.bal, 2));
    //var a = new Number(Math.round(Deposit.amount, 2));
    var b = new Number(Deposit.bal).toFixed(2);
    var a = new Number(Deposit.amount).toFixed(2);
    //console.log(b + 'rhans');
    //  console.log(this.state.file);

    /*  if (Number(a) > Number(b)) {
        Swal({
          type: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
        //console.log("invalid");
        //alert("invalid");
        this.setState({ visiblealertGreater: true });
        return;
      }*/

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

        const formData = new FormData();
        formData.append('myImage', this.state.file);
        formData.append('id', Deposit.id);
        formData.append('bal', Deposit.bal);
        formData.append('amount', Deposit.amount);
        formData.append('memo', Deposit.memo);
        formData.append('transaction_date', moment(this.state.salesDate).format('YYYY-MM-DD'));
        formData.append('date_deposited', moment(this.state.depositDate).format('YYYY-MM-DD'));
        formData.append('date_created', moment().format('YYYY-MM-DD'));
        formData.append('transaction_detail_type', Deposit.transaction_detail_type);
        formData.append('aria_trans_gl_code', Deposit.aria_trans_gl_code);

        const config = {
          headers: {
            'content-type': 'multipart/form-data',
          }
        };

        axios.post('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashdeposit/updatedeposit', formData, config)
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
  //-----------------------------------------------------------------
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
        axios.delete('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashdeposit/deletedeposit', {
          data: {
            id: Deposit.id
          }
        })
          .then(res => {
            //console.log(res);
            //console.log(res.data);
            this.setState({ toRedirect: true });
            //console.log("deleted");
            /*
            Swal(
              'Deleted!',
              'Transaction has been deleted.',
              'success'
            )*/
            Swal.fire({
              position: 'center',
              type: 'success',
              title: 'Transaction has been deleted.',
              showConfirmButton: false,
              timer: 2000
            })

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
        text: '15', value: 15
      }, {
        text: '30', value: 30
      }
        //, 
        //{
        //   text: 'All', value: products.length
        // }
      ] // A numeric array is also available. the purpose of above example is custom the text
    };

    function statusFormatter(cell, row) {
      if (row.reconciled === 1) {
        return (
          <span>
            <span><Badge color="success">RECONCILED</Badge></span>
          </span>
        );
      }
      else {

        return (
          <span><Badge color="danger">UNRECONCCILED</Badge></span>
        );
      }
    }

    function dateFormatter(cell, row) {
      return (
        <span>
          {moment(cell).format('L')}
        </span>
      );
    }

    function amountFormatter(cell, row) {
      if (cell == null) {
        var cell = 0;
      }

      return (
        <span>
          <IntlProvider locale="en"><FormattedNumber value={cell} /></IntlProvider>
        </span>
      );
    }

    function priceFormatter(column, colIndex, { sortElement, filterElement }) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filterElement}
          {column.text}
          {sortElement}
        </div>
      );
    }

    const { SearchBar } = Search;
    const { ExportCSVButton } = CSVExport;

    const products = this.state.Deposits;
    //start of sorting
    const headerSortingStyle = { backgroundColor: '#428aff' };
    const columns = [
      {
        dataField: 'branch_code',
        text: 'Branch',
        sort: true,
        headerSortingStyle,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: "Total : "
      },
      {
        dataField: 'id',
        text: 'Trans#',
        sort: true,
        headerSortingStyle,
        align: 'center',
        headerStyle: { backgroundColor: '#84b3ff' },
        // filter: textFilter(),
        headerFormatter: priceFormatter,//to put title down
        footer: ""
      },
      {
        dataField: 'transaction_date',
        text: 'Sales Date',
        sort: true,
        headerSortingStyle,
        formatter: dateFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: ""
      },
      {
        dataField: 'deposit_date',
        text: 'Deposit Date',
        sort: true,
        headerSortingStyle,
        formatter: dateFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: ""
      },
      {
        dataField: 'name',
        text: 'Type',
        sort: true,
        headerSortingStyle,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: ""
      },
      {
        dataField: '_net_amount',
        text: 'Amount',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: 'memo_',
        text: 'Memo',
        sort: true,
        headerSortingStyle,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: ""
      },
      {
        dataField: 'reconciled',
        text: 'Status',
        formatter: statusFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: ""
      },
      {
        dataField: 'banks',
        text: 'Banks',
        sort: true,
        headerSortingStyle,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: ""
      },
      {
        dataField: 'Update',
        text: 'Update',
        isDummyField: true,
        formatter: (products, row) => {
          if (row.reconciled == 0) {
            return (
              <Button outline color="info" size="sm" onClick={() => this.openModal(row)}><i className="fa fa-pencil-square-o"></i>&nbsp; Update</Button>
            );
          }
          else {
            return (
              <Button outline color="secondary" size="sm" onClick={() => this.openModal(row)} disabled><i className="fa fa-pencil-square-o"></i>&nbsp; Update</Button>
            );
          }

        },
        footer: ""
      },
      {
        dataField: 'Delete',
        text: 'Delete',
        isDummyField: true,
        formatter: (products, row) => {
          if (row.reconciled == 0) {
            return (
              <Button type="submit" outline color="danger" size="sm" onClick={() => this.handleDelete(row)}><i className="fa fa-trash-o"></i>&nbsp; Remove</Button>
            );
          }
          else {
            return (
              <Button type="submit" outline color="secondary" size="sm" onClick={() => this.handleDelete(row)} disabled><i className="fa fa-trash-o"></i>&nbsp; Remove</Button>
            );
          }
        },
        footer: ""
      },
      {
        dataField: 'View',
        text: 'View',
        formatter: (cellContent, row) => (
          <Button type="submit" outline color="dark" size="sm" onClick={() => this.viewImage(row)}><i className="fa fa-file-image-o"></i>&nbsp; Slip</Button>
        ),
        footer: ""
      }
    ];
    //<Button type="submit" outline color="danger" size="sm" onClick={() => this.handleDelete(row.id)}><i className="fa fa-trash-o"></i>&nbsp; Remove</Button>

    const defaultSorted = [{
      dataField: 'id',
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
    const totalcashsales = this.state.tCash.map((tCash, i) => tCash.cash);
    const totaldeposited = this.state.tDep.map((tDep, i) => tDep.cash);
    const totalwithdrawal = this.state.tWith.map((tWith, i) => tWith.cash);
    const totalbalance = totalcashsales - totaldeposited - totalwithdrawal;

    //loading sign
    if (this.state.loading == true) {
      var loader = <h6><Spinner name="ball-beat" color="steelblue" />Now Loading...</h6>;
    }
    else {
      var loader = '';
    }

    //loading image
    const images = [
      "http://" + BACKENDIP + ":" + BACKENDPORT + "/uploads/" + this.state.imgfilename + ""
    ];
    const { photoIndex } = this.state;

    const modalStyle = {
      overlay: {
        zIndex: 1,
        backgroundColor: 'transparent',
      },
      content: {
        top: 50,
        left: 0,
        right: 0,
        bottom: 0,
      },
    }

    var padding = 550;

    if (this.state.isOpenimage == true) {
      var imgloader =
        <Lightbox
          mainSrc={images[photoIndex]}
          onCloseRequest={() => this.setState({ isOpenimage: false })}
          reactModalStyle={modalStyle}
          imagePadding={padding}
          clickOutsideToClose={false}
          imageLoadErrorMessage='Sorry, No image found to load for this transaction.'
          imageCaption={'Deposit Slip of Transaction # : ' + this.state.imgcaption}
        />
    }
    else {
      var imgloader = '';
    }


    return (
      <div>
        {imgloader}
        <Modal isOpen={this.state.large} toggle={this.openModal} className={'modal-info ' + this.props.className} backdrop="static">
          <ModalHeader toggle={this.openModal}>Cash Deposit</ModalHeader>
          <ModalBody>
            <Card>
              <CardHeader>
                <strong>Update Cash Deposit</strong>
              </CardHeader>
              <CardBody>
                <Form onSubmit={this.handleSubmit}>
                  <Row>
                    <Col xs="6">
                      <FormGroup>
                        <Label htmlFor="salesDate">Sales Date:</Label>
                        {/* <DatePicker selected={this.state.salesDate} onChange={this.handleSalesDateChange} maxDate={moment()} minDate={moment().subtract(15, "days")} disabled={true}/> */}
                        <DatePicker selected={this.state.salesDate} onChange={this.handleSalesDateChange} maxDate={moment()} disabled={true} />
                      </FormGroup>
                    </Col>
                    <Col xs="6">
                      <h6>Cash from Sales: <IntlProvider locale="en">
                        <FormattedNumber value={totalcashsales} />
                      </IntlProvider>
                      </h6>
                      <h6>Deposited: <IntlProvider locale="en">
                        <FormattedNumber value={totaldeposited} />
                      </IntlProvider>
                      </h6>
                      <h6>Withdrawal: <IntlProvider locale="en">
                        <FormattedNumber value={totalwithdrawal} />
                      </IntlProvider>
                      </h6>
                      <h6>Balance: <IntlProvider locale="en">
                        <FormattedNumber value={totalbalance} />
                      </IntlProvider>
                      </h6>
                      <FormGroup>
                        <Input type="hidden" id="bal" name="bal" value={totalbalance} onChange={this.handleSalesDateChange} />
                        <Input type="hidden" id="upd" name="upd" value="1" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="6">
                      <FormGroup>
                        <Label htmlFor="depositDate">Deposit Date:</Label>
                        {/*} <DatePicker selected={this.state.depositDate} onChange={this.handleDepositDateChange} maxDate={moment()} minDate={moment().subtract(15, "days")}/>*/}
                        <DatePicker selected={this.state.depositDate} onChange={this.handleDepositDateChange} maxDate={moment()} />
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
                      <input type="file" name="myImage" onChange={this.handlefileChange} />
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
          keyField="id"
          data={products}
          columns={columns}
          search
          exportCSV={{
            fileName: 'OtherDeposit.csv'
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
                      <option value="1">Unreconciled</option>
                      <option value="2">Reconciled</option>
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

export default withRouter(CashDeposit);