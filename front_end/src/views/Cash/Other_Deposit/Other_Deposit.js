import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import { BACKENDIP, BACKENDPORT } from '../../../Database';

import {
  Badge, Row, Col, Card, CardHeader, CardBody, Button,
  Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert, InputGroupText, InputGroup, InputGroupAddon
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { IntlProvider, FormattedNumber } from 'react-intl';
import Swal from 'sweetalert2';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
//BrowserRouter as Router,
import { Switch, Route, withRouter } from "react-router-dom";
import Spinner from 'react-spinkit';
//import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
//import Spinner from 'react-spinkit';
//import Loadable from 'react-loadable';
//import { ToastContainer,toast } from 'react-toastify';
//import SweetAlert from 'react-bootstrap-sweetalert';
//import { withRouter } from "react-router";
//import withReactContent from 'sweetalert2-react-content';

class OtherDeposit extends React.Component {
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
      visible: false,
      alert: null,
      events: '',
      checker: false,
      maping: false,
      aria_trans_gl_code: '10102299',
      transaction_detail_type: '205',
      loading: true,
    }

    this.openAddModal = this.openAddModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSalesDateChange = this.handleSalesDateChange.bind(this);
    this.handleDepositDateChange = this.handleDepositDateChange.bind(this);
    this.handledeptypeChange = this.handledeptypeChange.bind(this);
    this.handlebanktypeChange = this.handlebanktypeChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    this.handleAdd = this.handleAdd.bind(this);

  }

  /*
  //-----START OF TABLE PART
  loadDeposits() {
    axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/otherdeposit/getdeposit')
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

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/otherdeposit/deposittypedropdown')
      .then(res => {
        const DepType = res.data;
        this.setState({ DepType });
      })
      .catch(function (error) {
        console.log(error);
      });

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/otherdeposit/bankdropdown')
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

  onDismiss() {
    this.setState({ visible: false });
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
          deposit_date: this.state.depositDate,
          transaction_detail_type: this.state.transaction_detail_type,
          aria_trans_gl_code: this.state.aria_trans_gl_code
        };
        //console.log("invalid");
        //alert("invalid");
        //console.log(Deposit);
        axios.defaults.withCredentials = true;
        axios.post('http://' + BACKENDIP + ':' + BACKENDPORT + '/otherdeposit/adddeposit', {
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
              'Transaction has been Added.',
              'success'
            );
            */
            // this.props.history.push("/sales/sales_audit")
            this.setState({ toRedirect: true });
          })

      }
    })
  }

  render() {
    if (this.state.toRedirect === true) {
      //console.log("go1");
      return (
        <Switch>
          <Route path="/cash/other_deposit" component={OtherDeposit} />
        </Switch>
      );
    }
    else {
      //console.log("go2");
      var thisYear = (new Date()).getFullYear();
      var start = new Date("1/1/" + thisYear);

      return (
        <div className="animated fadeIn">
          <Row>
            <Col>
              <Modal isOpen={this.state.large} toggle={this.openAddModal}
                className={'modal-success ' + this.props.className} backdrop="static">
                <ModalHeader toggle={this.openAddModal}>Other Deposit</ModalHeader>
                <ModalBody>
                  <Card>
                    <CardHeader>
                      <strong>Deposit Other Income</strong>
                    </CardHeader>
                    <CardBody>
                      <Form onSubmit={this.handleAdd}>
                        <Row>
                          <Col xs="6">
                            <FormGroup>
                              <Label htmlFor="salesDate">Transaction Date:</Label>
                              {/*<DatePicker selected={this.state.salesDate} onChange={this.handleSalesDateChange} maxDate={moment()} minDate={moment().subtract(15, "days")}/>*/}
                              <DatePicker selected={this.state.salesDate} onChange={this.handleSalesDateChange} minDate={moment(start.valueOf())} />
                            </FormGroup>
                          </Col>
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
                            <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismiss}>
                              The amount entered is greater than remaining balance!
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
                        <Button type="submit" size="sm" color="primary" aria-hidden="true" ><i className="fa fa-dot-circle-o"></i> Submit</Button>
                      </Form>
                    </CardBody>
                  </Card>
                </ModalBody>
                <ModalFooter>
                  <Button color="secondary" onClick={this.closeModal}>Close</Button>
                </ModalFooter>
              </Modal>
            </Col>
          </Row>
          <div>
            <Row>
              <Col>
                <Card>
                  <CardHeader>
                    <i className="fa fa-shopping-cart"></i> Other Deposit
                <Button color="success" className="float-right" onClick={this.openAddModal}><i className="fa fa-plus-square"></i>&nbsp; Record Other Deposit</Button>
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

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/otherdeposit/getsalescash')
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
    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/otherdeposit/bankdropdown')
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
      visible: false,
      toRedirect: false,
      idx: '',
      amount: '',
      dateFrom: moment(),
      dateTo: moment(),
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
    this.onDismiss = this.onDismiss.bind(this);
    this.handleDateFromChange = this.handleDateFromChange.bind(this);
    this.handleDateToChange = this.handleDateToChange.bind(this);
    this.handleChangestatusType = this.handleChangestatusType.bind(this);
  }

  componentDidMount() {
    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/otherdeposit/getdeposit', {
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

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/otherdeposit/getfilterdeposit', {
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
      salesDate: moment(Depositdata.date_created),
      depositDate: moment(Depositdata.transaction_date),
      aria_trans_gl_code: Depositdata.aria_trans_gl_code,
      transaction_detail_type: Depositdata.transaction_type,
    });

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/otherdeposit/deposittypedropdown')
      .then(res => {
        const DepType = res.data;
        this.setState({ DepType });
      })
      .catch(function (error) {
        console.log(error);
      });

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/otherdeposit/bankdropdown')
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

  onDismiss() {
    this.setState({ visible: false });
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

    //var b = new Number(Math.round(Deposit.bal, 2));
    //var a = new Number(Math.round(Deposit.amount, 2));

    var b = new Number(Deposit.bal).toFixed(2);
    var a = new Number(Deposit.amount).toFixed(2);

    //console.log(b);
    //console.log(a);

    // console.log(Deposit);
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
        axios.put('http://' + BACKENDIP + ':' + BACKENDPORT + '/otherdeposit/updatedeposit', {
          id: Deposit.id,
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
            this.setState({ toRedirect: true });
            /*
            Swal(
              'Updated!',
              'Transaction has been updated.',
              'success'
            )
            */
            Swal.fire({
              position: 'center',
              type: 'success',
              title: 'Transaction has been updated.',
              showConfirmButton: false,
              timer: 2000
            })

          })
      }
    })

  }
  //------------------------------------------------------------
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
        axios.delete('http://' + BACKENDIP + ':' + BACKENDPORT + '/otherdeposit/deletedeposit', {
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


    function dateFormatter(cell, row) {
      return (
        <span>
          {moment(cell).format('L')}
        </span>
      );
    }

    function amountFormatter(cell, row) {
      return (
        <span>
          <IntlProvider locale="en"><FormattedNumber value={cell} /></IntlProvider>
        </span>
      );
    }

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
        headerStyle: { backgroundColor: '#84b3ff' }
      },
      {
        dataField: 'id',
        text: 'Trans#',
        sort: true,
        headerSortingStyle,
        align: 'center',
        headerStyle: { backgroundColor: '#84b3ff' },
        // filter: textFilter(),
        headerFormatter: priceFormatter //to put title down
      },
      {
        dataField: 'date_created',
        text: 'Deposit Date',
        sort: true,
        headerSortingStyle,
        formatter: dateFormatter,
        headerStyle: { backgroundColor: '#84b3ff' }
      },
      {
        dataField: 'transaction_date',
        text: 'Trans Date',
        sort: true,
        headerSortingStyle,
        formatter: dateFormatter,
        headerStyle: { backgroundColor: '#84b3ff' }
      },
      {
        dataField: 'name',
        text: 'Type',
        sort: true,
        headerSortingStyle,
        headerStyle: { backgroundColor: '#84b3ff' }
      },
      {
        dataField: '_net_amount',
        text: 'Amount',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' }
      },
      {
        dataField: 'memo_',
        text: 'Memo',
        sort: true,
        headerSortingStyle,
        headerStyle: { backgroundColor: '#84b3ff' }
      },
      {
        dataField: 'reconciled',
        text: 'Status',
        formatter: statusFormatter,
        headerStyle: { backgroundColor: '#84b3ff' }
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

        }
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
        }
      }
    ];
    //<Button type="submit" outline color="danger" size="sm" onClick={() => this.handleDelete(row.id)}><i className="fa fa-trash-o"></i>&nbsp; Remove</Button>

    const defaultSorted = [{
      dataField: 'id',
      order: 'desc'
    }];

    if (this.state.toRedirect === true) {
      //console.log("go1");
      return (
        <Switch>
          <Route path="/cash/other_deposit" component={Pagis} />
        </Switch>
      );
    }

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
          <ModalHeader toggle={this.openModal}>Other Deposit</ModalHeader>
          <ModalBody>
            <Card>
              <CardHeader>
                <strong>Update Other Income Deposit</strong>
              </CardHeader>
              <CardBody>
                <Form onSubmit={this.handleSubmit}>
                  <Row>
                    <Col xs="6">
                      {<h6>Transaction #: {this.state.idx}</h6>}
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="6">
                      <FormGroup>
                        <Label htmlFor="salesDate">Transaction Date:</Label>
                        {/*<DatePicker selected={this.state.salesDate} onChange={this.handleSalesDateChange} maxDate={moment()} minDate={moment().subtract(15, "days")} disabled={true}/>*/}
                        <DatePicker selected={this.state.salesDate} onChange={this.handleSalesDateChange} maxDate={moment()} disabled={true} minDate={moment().subtract(5, "days")} />
                      </FormGroup>
                    </Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label htmlFor="depositDate">Deposit Date:</Label>
                        {/*<DatePicker selected={this.state.depositDate} onChange={this.handleDepositDateChange} maxDate={moment()} minDate={moment().subtract(15, "days")}/> */}
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
                      <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismiss}>
                        The amount entered is greater than remaining balance!
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
                  <Button type="submit" size="sm" color="primary" ><i className="fa fa-dot-circle-o"></i> Update</Button>
                </Form>
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.closeModal}>Close</Button>
          </ModalFooter>
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
                    <Label htmlFor="depositDate">From Date:</Label>
                    <DatePicker selected={this.state.dateFrom} onChange={this.handleDateFromChange} maxDate={moment()} />
                  </Col>
                  <Col>
                    <Label htmlFor="depositDate">To Date:</Label>
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

export default withRouter(OtherDeposit);