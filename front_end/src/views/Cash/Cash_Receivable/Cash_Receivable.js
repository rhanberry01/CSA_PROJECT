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
import { isNullOrUndefined } from 'util';
//BrowserRouter as Router,
import { Switch, Route, withRouter } from "react-router-dom";
import Spinner from 'react-spinkit';


class CashReceivable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toRedirect: false,
      dateFrom: moment(),
      dateTo: moment(),
      loading: true,
    }
  }

  render() {
    if (this.state.toRedirect === true) {
      //console.log("go1");
      return (
        <Switch>
          <Route path="/cash/cash_receivable" component={CashReceivable} />
        </Switch>
      );
    }
    else {
      //console.log("go2");
      return (
        <div className="animated fadeIn">
          <div>
            <Row>
              <Col>
                <Card>
                  <CardHeader>
                    <i className="fa fa-shopping-cart"></i> Recon Receivables from Sales
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
    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashreceivable/bankdropdown')
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
      triggerModal: false,
      tPay: [],
      tCash: [],
      tDep: [],
      tWith: [],
      DepType: [],
      Banks: [],
      Tender: [],
      visiblealert: false,
      toRedirect: false,
      idx: [],
      amount: '',
      tSelected: [],
      selectedx: [],
      onSelect: [],
      onSelectAll: [],
      modal: false,
      date_from: '',
      date_to: '',
      dateFrom: moment(),
      dateTo: moment(),
      depositDate: moment(),
      aria_trans_gl_code: '10102299',
      tendercode: '0',
      memo: '',
      loading: true,
      overpayment: '',
      selectedOption: '',
      overtype: '',
      otherincome: '',
      dueee: 0,
      overtypename: ''
    };

    this.toggle = this.toggle.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.viewModal = this.viewModal.bind(this);
    this.closeModalView = this.closeModalView.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onChangeRadioValue = this.onChangeRadioValue.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleAmountChangeDueEE = this.handleAmountChangeDueEE.bind(this);
    this.handleSalesDateChange = this.handleSalesDateChange.bind(this);
    this.handleDepositDateChange = this.handleDepositDateChange.bind(this);
    this.handledeptypeChange = this.handledeptypeChange.bind(this);
    this.handlebanktypeChange = this.handlebanktypeChange.bind(this);
    this.handletendertypeChange = this.handletendertypeChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDateFromChange = this.handleDateFromChange.bind(this);
    this.handleDateToChange = this.handleDateToChange.bind(this);
    this.handleChangestatusType = this.handleChangestatusType.bind(this);
    this.onAlert = this.onAlert.bind(this);
  }
  /*
      componentDidMount() {
        axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/cashreceivable/getdeposit')
          .then(res => {
            const Deposits = res.data;
            this.setState({ Deposits });
            console.log(Deposits);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
      */


  componentDidMount() {
    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashreceivable/getdeposit', {
      params: {
        date_from: this.state.dateFrom.subtract(30, 'days').format('YYYY-MM-DD'),
        date_to: this.state.dateTo.format('YYYY-MM-DD'),

      }
    })
      .then(res => {
        const Deposits = res.data;
        this.setState({ Deposits, loading: false });
        //  console.log(Deposits)
        // console.log("x");
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
    this.setState({ loading: true });

    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashreceivable/getfilterdeposit', {

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


  toggle(checkboxdata) {

    //console.log(checkboxdata);
    //console.log(checkboxdata.selected);
    //var doubled = checkboxdata.map((number) => number);

    if (checkboxdata.selected == "") {

      Swal({
        type: 'error',
        title: 'Oops...',
        text: 'No transaction has been selected to reconcile.',
      })
      //console.log("invalid");
      //alert("invalid");

      return;
    }

    this.setState({
      triggerModal: !this.state.triggerModal,
      idx: checkboxdata,

    });

    // console.log(doubled);
    this.setState(prevState => ({
      modal: !prevState.modal
    }));

    if (checkboxdata.selected !== '' && !isNullOrUndefined(checkboxdata.selected)) {

      axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashreceivable/tenderdropdown')
        .then(res => {
          const Tender = res.data;
          this.setState({ Tender });
        })
        .catch(function (error) {
          console.log(error);
        });

      axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashreceivable/bankdropdown')
        .then(res => {
          const Banks = res.data;
          this.setState({ Banks });
        })
        .catch(function (error) {
          console.log(error);
        });

      axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashreceivable/getselecteddeposit', {
        params: {
          id: checkboxdata.selected,
        }
      })
        .then(res => {
          const tSelected = res.data;
          this.setState({ tSelected });
          //console.log(tSelected);

        })
        .catch(function (error) {
          console.log(error);
        });

      axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashreceivable/getpayment', {
        params: {
          id: checkboxdata.selected,
        }
      })
        .then(res => {
          const tWith = res.data;
          this.setState({ tWith });
          //console.log(tWith);
        })
        .catch(function (error) {
          console.log(error);
        });


    }

  }

  openModal() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  closeModalView() {
    this.setState(prevState => ({
      modalview: !prevState.modalview
    }));
  }

  viewModal(row) {
    this.setState(prevState => ({
      modalview: !prevState.modalview,
      idx: row.id,
      trans_no: row.trans_no,
    }));


    axios.get('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashreceivable/getpaymenhistory', {
      params: {
        id: row.trans_no,
      }
    })
      .then(res => {
        const tPay = res.data;
        this.setState({ tPay });
        //console.log(tPay);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  closeModal() {
    this.setState(prevState => ({
      triggerModal: !prevState.triggerModal
    }));
  }

  handleDepositDateChange(date) {
    this.setState({
      depositDate: date
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

  handleSalesDateChange(date) {
    this.setState({
      salesDate: date
    });
  }

  handleChange(e) {
    // check it out: we get the evt.target.name (which will be either "email" or "password")
    // and use it to target the key on our `state` object with the same name, using bracket syntax
    this.setState({ [e.target.name]: e.target.value });
    // console.log(this.state.value);
  }




  onChangeRadioValue(e) {
    // check it out: we get the evt.target.name (which will be either "email" or "password")
    // and use it to target the key on our `state` object with the same name, using bracket syntax
    this.setState({ selectedOption: e.target.value });
    this.setState({ overtypename: e.target.name });
    this.setState({ overtype: e.target.value });
    //console.log(e.target.value);
  }

  handleAmountChange(e) {
    // check it out: we get the evt.target.name (which will be either "email" or "password")
    // and use it to target the key on our `state` object with the same name, using bracket syntax
    this.setState({ amount: e.target.value, otherincome: e.target.value });
    //console.log(this.state.value);
  }

  handleAmountChangeDueEE(e) {
    // check it out: we get the evt.target.name (which will be either "email" or "password")
    // and use it to target the key on our `state` object with the same name, using bracket syntax
    this.setState({ dueee: e.target.value });
    //console.log(this.state.value);
  }

  handledeptypeChange(e) {
    this.setState({ transaction_detail_type: e.target.value });
  }

  handlebanktypeChange(e) {
    this.setState({ aria_trans_gl_code: e.target.value });
  }

  handletendertypeChange(e) {
    this.setState({ tendercode: e.target.value });
  }

  onAlert() {
    this.setState({ visiblealert: false });
  }

  handleAdd(e) {
    //const MySwal = withReactContent(Swal)
    //console.log(e); 
    e.preventDefault();
    e.persist(); //to remove synthetic event
    if (this.state.dueee <= 0) {
      if (this.state.amount <= 0) {

        Swal({
          type: 'error',
          title: 'Oops...',
          text: 'zero, negative and empty amount is not accepted.',
        })

        this.setState({ visiblealert: true });
        return;
      }
    }


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
          selected_ids: e.target.selected_ids.value,
          sales_date: e.target.sales_date.value,
          trans_type: e.target.trans_type.value,
          ref: e.target.ref.value,
          amount: this.state.amount,
          dueee: this.state.dueee,
          memo: this.state.memo,
          transaction_date: this.state.salesDate,
          date_created: this.state.depositDate,
          transaction_detail_type: this.state.transaction_detail_type,
          aria_trans_gl_code: this.state.aria_trans_gl_code,
          tendercode: this.state.tendercode,
          t_receivable: e.target.t_receivable.value,
          t_otherincome: e.target.t_otherincome.value,
          overtype: e.target.overtype.value,
          t_paid: e.target.t_paid.value,
          due_to_customer: e.target.due_to_customer.value
        };

        //console.log(Deposit);
        axios.defaults.withCredentials = true;
        axios.post('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashreceivable/adddeposit', {
          amount: Deposit.amount,
          dueee: Deposit.dueee,
          memo: Deposit.memo,
          deposit_date: moment(this.state.depositDate).format('YYYY-MM-DD'),
          date_created: moment().format('YYYY-MM-DD'),
          transaction_detail_type: Deposit.transaction_detail_type,
          aria_trans_gl_code: Deposit.aria_trans_gl_code,
          tendercode: Deposit.tendercode,
          selected_ids: Deposit.selected_ids,
          sales_date: moment(Deposit.depositDate).format('YYYY-MM-DD'),
          trans_type: Deposit.trans_type,
          t_receivable: Deposit.t_receivable,
          t_otherincome: Deposit.t_otherincome,
          due_to_customer: Deposit.due_to_customer,
          overtype: Deposit.overtype,
          t_paid: Deposit.t_paid,
          ref: Deposit.ref,
        })
          .then(res => {

            // console.log(res);
            //console.log(res.data);

            Swal.fire({
              position: 'center',
              type: 'success',
              title: 'Transaction has been Added.',
              showConfirmButton: false,
              timer: 2000
            }).then((timer) => {
              this.setState({ toRedirect: true });
            })



          })
      }
    }

    )
  }

  //-----------------------------------------------------------
  getInitialState() {
    return { display: true };
  }


  handleDelete(Depositdata) {
    // console.log(Depositdata);
    const Deposit = {
      trans_no: Depositdata.trans_no,
      central_sales_audit_id: Depositdata.central_sales_audit_id
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
        axios.delete('http://' + BACKENDIP + ':' + BACKENDPORT + '/cashreceivable/deletedeposit', {
          data: {
            id: Deposit.central_sales_audit_id,
            trans_no: Deposit.trans_no
          }
        })
          .then(res => {
            this.setState({ toRedirect: true });
            Swal.fire({
              position: 'center',
              type: 'success',
              title: 'Payment transaction has been Voided.',
              showConfirmButton: false,
              timer: 2000
            })

          })
      }
    })
  }


  handleOnSelect = (row, isSelect) => {
    if (isSelect) {
      this.setState(() => ({
        selectedx: [...this.state.selectedx, row.trans_no]
      }));
    } else {
      this.setState(() => ({
        selectedx: this.state.selectedx.filter(x => x !== row.trans_no)
      }));
    }
  }

  handleOnSelectAll = (isSelect, rows) => {
    const ids = rows.map(r => r.trans_no);
    if (isSelect) {
      this.setState(() => ({
        selectedx: ids
      }));
    } else {
      this.setState(() => ({
        selectedx: []
      }));
    }
  }

  render() {


    //start of disable checkbox
    /*
   var Disabled = this.state.Deposits.filter(function (selecteddisabled) {
     return selecteddisabled.paid == 1;
   });
   */
    const getDisabled = this.state.Deposits.filter(rec => rec.paid === 1);
    //console.log(getDisabled);

    var arrDisabled = getDisabled.map(function (mylist) {
      return mylist.trans_no;
    });
    //end of to disable textbox


    //console.log(arrDisabled);
    //for checkbox
    const selectRow = {
      mode: 'checkbox',
      //clickToSelect: true,
      bgColor: '#e3ecf4',

      selected: this.state.selectedx,
      onSelect: this.handleOnSelect,
      onSelectAll: this.handleOnSelectAll,
      nonSelectable: arrDisabled
    };

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
      hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
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
      if (cell == null) {
        var cell = 0;
      }

      return (
        <span>
          <IntlProvider locale="en"><FormattedNumber value={cell} /></IntlProvider>
        </span>
      );
    }

    function statusFormatter(cell, row) {
      if (row.paid === 1) {
        return (
          <span>
            <span><Badge color="success">PAID</Badge></span>
          </span>
        );
      }
      else if (row.trans_amount < 0) {
        return (
          <span>
            <span><Badge color="secondary">RETURN</Badge></span>
          </span>
        );
      }
      else {
        return (
          <span><Badge color="danger">UNPAID</Badge></span>
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
    // console.log(products);
    //start of sorting
    const headerSortingStyle = { backgroundColor: '#428aff' };
    const columns = [
      {
        dataField: 'trans_no',
        text: 'OR#',
        sort: true,
        headerSortingStyle,
        align: 'center',
        headerStyle: { backgroundColor: '#84b3ff' },
        // filter: textFilter(),
        headerFormatter: priceFormatter,
        footer: "Total" //to put title down
      },
      {
        dataField: 'transaction_date',
        text: 'Sales Date',
        sort: true,
        headerSortingStyle,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: ""
      },
      {
        dataField: 'account_name',
        text: 'Name',
        sort: true,
        headerSortingStyle,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: ""
      },
      {
        dataField: 'category_desc',
        text: 'Transaction',
        sort: true,
        headerSortingStyle,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: ""
      },
      {
        dataField: 'trans_amount',
        text: 'Amount',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: 'paidtotal',
        text: 'Paid',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: '_ewt',
        text: 'EWT',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: '_oi_amount',
        text: 'Other Income',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: 'due_to_customer',
        text: 'Over Payment',
        sort: true,
        headerSortingStyle,
        formatter: amountFormatter,
        headerStyle: { backgroundColor: '#84b3ff' },
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: 'due_to_employee',
        text: 'Due to EE',
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
          var balance = row.trans_amount - row.paidtotal + row._oi_amount - row._ewt + row.due_to_customer - row.due_to_employee;
          // console.log(row.due_to_customer);
          if (balance < 0) {
            return (
              <IntlProvider locale="en"><FormattedNumber value={balance} /></IntlProvider>
            );
          }
          else {
            return (
              <IntlProvider locale="en"><FormattedNumber value={Math.abs(balance)} /></IntlProvider>
            );
          }


        },

        headerStyle: { backgroundColor: '#84b3ff' },
        //  footer: products.map((items, num) => num)
        // footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      },
      {
        dataField: 'card_desc',
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
        dataField: 'Void',
        text: 'Void',
        isDummyField: true,
        formatter: (products, row) => {
          //console.log(row.paidtotal + 'paid');

          if (row.central_sales_audit_id != null && row.aria_throw != 1) {
            return (
              <Button type="submit" outline color="danger" size="sm" onClick={() => this.handleDelete(row)}><i className="fa fa-pencil-square-o"></i>&nbsp; Void</Button>
            );
          } else if (row.aria_throw == 1) {
            return (<Button type="submit" outline color="secondary" size="sm" onClick={() => this.handleDelete(row)} disabled><i className="fa fa-pencil-square-o"></i>&nbsp; Uploaded </Button>
            );
          } else {
            return (
              <Button type="submit" outline color="secondary" size="sm" onClick={() => this.handleDelete(row)} disabled><i className="fa fa-pencil-square-o"></i>&nbsp; Void</Button>
            );
          }

        },
        footer: ""
      },
      {
        dataField: 'View',
        text: 'View',
        formatter: (cellContent, row) => (
          <Button type="submit" outline color="primary" size="sm" onClick={() => this.viewModal(row)}><i className="fa fa-pencil-square-o"></i>&nbsp; View</Button>
        ),
        footer: ""
      }
    ];


    //<Button type="submit" outline color="danger" size="sm" onClick={() => this.handleDelete(row.id)}><i className="fa fa-trash-o"></i>&nbsp; Remove</Button>

    const defaultSorted = [{
      dataField: 'trans_no',
      order: 'desc'
    }];



    const totalselected = this.state.tSelected.reduce((accumulator, tSelected) => accumulator + tSelected.trans_amount, 0);
    const totalpaid = this.state.tWith.map((tWith, i) => tWith.total_paid)
    const due_to_customer = this.state.tWith.map((tWith, i) => tWith.due_to_customer)

    //console.log(totalselected);
    //console.log(totalpaid);

    //console.log('---' + this.state.otherincome);

    //console.log('---' + this.state.dueee);

    var oiamount = 0;
    var overtype = this.state.overtype;
    var chk_oi = (((totalselected - totalpaid) - this.state.otherincome) - parseInt(this.state.dueee)).toFixed(2);

    var stat = 0;
    switch (this.state.overtype) {
      case 'wtv': // ewt 
        var val = ((totalselected / 1.12) * 0.01);
        var stat = 1;
        // console.log(val + "ewt");
        break;
      case 'wtnv': // ewt 
        var val = (totalselected * 0.01);
        var stat = 1;
        // console.log(val + "ewt");
        break;
      case 'ot': // otherincome
        var chk_oi = (((totalselected - totalpaid) - this.state.otherincome) - parseInt(this.state.dueee)).toFixed(2);
        //chk_oi = parseInt(chk_oi) + parseInt();

        if (chk_oi < 0) {
          var val = Math.abs(((totalselected - totalpaid) - this.state.otherincome) - parseInt(this.state.dueee)).toFixed(2);
          var stat = 1;
        } else {
          var stat = 0;
        }
        break;
      case 'ov': // overpayement
        var chk_oi = (((totalselected - totalpaid) - this.state.otherincome) - parseInt(this.state.dueee)).toFixed(2);
        if (chk_oi < 0) {
          var val = Math.abs(((totalselected - totalpaid) - this.state.otherincome) - parseInt(this.state.dueee)).toFixed(2);
          var stat = 1;
        } else {
          var stat = 0;
        }
      // console.log(val + "overpayement");
    }

    if (stat == 1) {
      oiamount = Math.abs(val).toFixed(2);
      var overpayment =
        (<Col sm="3">
          <h6 className="text-success"> {this.state.overtypename} <IntlProvider locale="en">
            <FormattedNumber value={oiamount} />
          </IntlProvider>
          </h6>
        </Col>);
    }




    var notifyZero = "zero, empty and negative amount are invalid!";

    if (this.state.toRedirect === true) {
      //console.log("go1");
      return (
        <Switch>
          <Route path="/cash/cash_receivable" component={Pagis} />
        </Switch>
      );
    }
    const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
    const externalCloseBtnx = <button className="close"></button>;

    //loading sign
    if (this.state.loading == true) {
      var loader = <h6><Spinner name="ball-beat" color="steelblue" />Now Loading...</h6>;
    }
    else {
      var loader = '';
    }

    if (due_to_customer != 0) {
      this.state.amount = due_to_customer;
    }

    return (
      <div>

        <Modal isOpen={this.state.modal} size="lg" toggle={this.toggle} className={'modal-success ' + this.props.className} external={externalCloseBtn} backdrop="static">
          <ModalHeader toggle={this.toggle}>Cash Receivables</ModalHeader>
          <ModalBody>
            <Card>
              <CardHeader>
                <strong>Reconcile Receivables</strong>
              </CardHeader>
              <CardBody>
                <Form onSubmit={this.handleAdd}>
                  <Row>
                    <Col>
                      {<h6>Transaction #: {this.state.selectedx.join(',')}</h6>}
                      {/*<h6>Sales Date: {this.state.tSelected.map((tSelected, i) => moment(tSelected.transaction_date).format('YYYY-MM-DD'))}</h6>*/}
                    </Col>
                    <Col>
                      <h6>Total Receivable: <IntlProvider locale="en">
                        <FormattedNumber value={totalselected} />
                      </IntlProvider>
                      </h6>
                      <h6>Total Paid: <IntlProvider locale="en">
                        <FormattedNumber value={totalpaid} />
                      </IntlProvider>
                      </h6>
                      <h6>Due: <IntlProvider locale="en">
                        <FormattedNumber value={totalselected - totalpaid} />
                      </IntlProvider>
                      </h6>
                      <h6>Over Payment: <IntlProvider locale="en">
                        <FormattedNumber value={due_to_customer} />
                      </IntlProvider>
                      </h6>
                      <FormGroup>
                        <Input type="hidden" id="sales_date" name="sales_date" value={this.state.tSelected.map((tSelected, i) => tSelected.transaction_date)} />
                        <Input type="hidden" id="trans_type" name="trans_type" value={this.state.tSelected.map((tSelected, i) => tSelected.tender_type)} />
                        <Input type="hidden" id="t_receivable" name="t_receivable" value={totalselected} />
                        <Input type="hidden" id="t_paid" name="t_paid" value={totalpaid} />
                        <Input type="hidden" id="selected_ids" name="selected_ids" value={this.state.selectedx} />
                        <Input type="hidden" id="t_otherincome" name="t_otherincome" value={oiamount} />
                        <Input type="hidden" id="overtype" name="overtype" value={overtype} />
                        <Input type="hidden" id="due_to_customer" name="due_to_customer" value={due_to_customer} />
                      </FormGroup>
                    </Col>
                  </Row >
                  <hr />
                  <Row>
                    <Col xs="6">
                      <FormGroup>
                        <Label htmlFor="depositDate">Payment Date:</Label>
                        {/*<DatePicker selected={this.state.depositDate} onChange={this.handleDepositDateChange} maxDate={moment()} minDate={moment().subtract(5, "days")}/>*/}
                        <DatePicker selected={this.state.depositDate} onChange={this.handleDepositDateChange} maxDate={moment()} />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="6">
                      <FormGroup>
                        <Label htmlFor="tenderdropdown">Payment Type:</Label>
                        <Input type="select" name="tendercode" id="tendercode" value={this.state.TenderCode} onChange={this.handletendertypeChange}>
                          {this.state.Tender.map((Tender, i) => <option key={Tender.TenderCode} value={Tender.TenderCode}>{Tender.Description}</option>)}
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col xs="6">
                      <FormGroup>
                        <Label htmlFor="bankdropdown">Bank Account:</Label>
                        <Input type="select" name="aria_trans_gl_code" id="aria_trans_gl_code" value={this.state.aria_trans_gl_code} onChange={this.handlebanktypeChange}>
                          {this.state.Banks.map((Banks, i) => <option key={Banks.account_code} value={Banks.account_code}>{Banks.bank_account_name}</option>)}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <FormGroup>
                        <Label htmlFor="amount">Amount to Pay:</Label>
                        <Alert color="danger" isOpen={this.state.visiblealert} toggle={this.onAlert}>

                        </Alert>
                        <Input type="number" id="amount" name="amount" placeholder="Enter Amount.." value={this.state.amount} onChange={this.handleAmountChange} />
                      </FormGroup>
                    </Col>
                    <Col xs="3">
                      <Label htmlFor="dueee">Due EE</Label>
                      <Input type="number" id="duee" name="duee" placeholder="Enter Amount.." value={this.state.dueee} onChange={this.handleAmountChangeDueEE} />
                    </Col>

                    <Col xs="3">
                      <Label htmlFor="ref">Ref#, Check#, DM#, OR#</Label>
                      <Input type="text" id="ref" name="ref" placeholder="Enter Reference Num.." onChange={this.handleChange} />
                    </Col>
                  </Row>
                  <Row >
                    <Col xs="2">
                      <FormGroup>
                        <input type="radio" value="wtnv" name="WITH EWT NON VAT : " checked={this.state.selectedOption === "wtnv"} onChange={this.onChangeRadioValue} /> EWT-NVAT
                      </FormGroup>
                    </Col>
                    <Col xs="2">
                      <FormGroup>
                        <input type="radio" value="wtv" name="WITH EWT VAT: " checked={this.state.selectedOption === "wtv"} onChange={this.onChangeRadioValue} /> EWT-VAT
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <input type="radio" value="ot" name="OTHER INCOME:" checked={this.state.selectedOption === "ot"} onChange={this.onChangeRadioValue} />OI Cashier Overage/Shipping Fee
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <input type="radio" value="ov" name="OVERPAYMENT : " checked={this.state.selectedOption === "ov"} onChange={this.onChangeRadioValue} /> Over Payment
                      </FormGroup>
                    </Col>

                  </Row>
                  <Col xs="12"> {overpayment}</Col>
                  <Row >
                  </Row>
                  <FormGroup row>
                    <Col xs="6">
                      <Label htmlFor="memo">Memo:</Label>
                      <Input type="textarea" name="memo" id="memo" rows="3" placeholder="Enter Memo..." value={this.state.memo} onChange={this.handleChange} />
                    </Col>
                  </FormGroup>
                  <Row>
                    <Col xs="10">
                      <Button type="submit" size="sm" color="success" ><i className="fa fa-dot-circle-o"></i> Submit</Button>
                    </Col>
                    <Col xs="-2">
                      <Button color="secondary" onClick={this.toggle}>Close</Button>
                    </Col>
                  </Row>
                </Form >
              </CardBody >
            </Card >
          </ModalBody >
        </Modal >

        <Modal isOpen={this.state.modalview} toggle={this.viewModal}
          className={'modal-info ' + this.props.className} external={externalCloseBtnx} backdrop="static">
          <ModalHeader toggle={this.viewModal}>Receivables (Payment History)</ModalHeader>
          <ModalBody>
            <Card>
              <CardHeader>
                <strong>Transaction History</strong>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col>
                    <h6>OR #:{this.state.trans_no}</h6>
                    {this.state.tPay.map((tPay, i) =>
                    (<h6 key={i}>
                      Payment Reference #: {tPay.id}<br />
                          Date paid : {moment(tPay.deposit_date).format('YYYY-MM-DD')}<br />
                          Amount paid : {tPay._net_amount}<br />
                          Memo : {tPay.memo_}<br />
                          Other Income : {tPay._oi_amount}<br />
                          EWT : {tPay._ewt}<br />
                          Due to Customer : {tPay.due_to_customer}<br />
                          Tender : {tPay.tender_code}<br />
                          Due to Employee : {tPay.due_to_employee}<br />
                          Bank : {tPay.aria_trans_gl_code}<br />
                    </h6>))}


                  </Col>
                </Row>
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.closeModalView}>Close</Button>
          </ModalFooter>
        </Modal>


        {/* START OF TABLE ToolkitProvider w/ check row*/}

        <ToolkitProvider
          keyField="trans_no"
          data={products}
          columns={columns}
          search
          exportCSV={{
            fileName: 'CashReceivable.csv'
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
                      <option value="1">Unpaid</option>
                      <option value="2">Paid</option>
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
                <Row>
                  <Col sm="6">
                    <Button color="success" className="float-left" onClick={() => this.toggle(selectRow)}><i className="fa fa-plus-square"></i>&nbsp; Reconcile Receivables</Button>
                  </Col>

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
                  selectRow={selectRow}
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

        </ToolkitProvider>   {/* END OF TABLE ToolkitProvider w/ check row*/}

      </div >
    )
  }
}

export default withRouter(CashReceivable);