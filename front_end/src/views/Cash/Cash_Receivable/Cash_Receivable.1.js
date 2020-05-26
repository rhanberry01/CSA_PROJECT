import React, {Component} from 'react';
import { render, findDOMNode } from 'react-dom';
import axios from 'axios';
import { Badge, Row, Col, Card, CardHeader, CardBody, Button, CardFooter,
Modal, ModalHeader, ModalBody, ModalFooter, Form,FormGroup,Label, Input, Alert
} from 'reactstrap';

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

//BrowserRouter as Router,
import { Link, Switch, Route, withRouter } from "react-router-dom";
//import { withRouter } from "react-router";

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { isNull, isNullOrUndefined } from 'util';
import { isClass, isClassBody, isClassMethod } from 'babel-types';

class CashReceivable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
       toRedirect: false,
    }
}

//-----START OF TABLE PART
loadDeposits() {
  axios.get('http://192.168.0.188:4001/cashreceivable/getdeposit')
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
 
render() {
  if (this.state.toRedirect === true){
  console.log("go1");
    return (
      <Switch>
       <Route path="/cash/cash_receivable" component={CashReceivable}/>
      </Switch>
      );
    }
  else{
  console.log("go2");
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
                <Pagis/>
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

      axios.get('http://192.168.0.188:4001/cashreceivable/getsalescash')
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
    axios.get('http://192.168.0.188:4001/cashreceivable/bankdropdown')
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

  class Pagis extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        Deposits: [],
        id: '',
        triggerModal: false,
        bal: '',
        tCash: [],
        tDep: [],
        tWith: [],
        DepType: [],
        Banks: [],
        visible: false,
        toRedirect: false,
        idx:[],
        amount: '',
        tSelected:[],
        selectedx:[],
        onSelect:[],
        onSelectAll:[],
        modal: false,
      };
  
      this.toggle = this.toggle.bind(this);
      this.openModal = this.openModal.bind(this);
      this.viewModal = this.viewModal.bind(this);
      this.closeModal = this.closeModal.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSalesDateChange = this.handleSalesDateChange.bind(this);
      this.handleDepositDateChange = this.handleDepositDateChange.bind(this);
      this.handledeptypeChange = this.handledeptypeChange.bind(this);
      this.handlebanktypeChange = this.handlebanktypeChange.bind(this);
      this.handleAdd = this.handleAdd.bind(this);
      this.onDismiss = this.onDismiss.bind(this);
    }

    componentDidMount() {
      axios.get('http://192.168.0.188:4001/cashreceivable/getdeposit')
        .then(res => {
          const Deposits = res.data;
          this.setState({ Deposits });
          console.log(Deposits);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    toggle(checkboxdata) {

     console.log(checkboxdata);
     console.log(checkboxdata.selected);
      //var doubled = checkboxdata.map((number) => number);
      this.setState({
        triggerModal: !this.state.triggerModal,
        idx: checkboxdata,
        
      });

           // console.log(doubled);
     this.setState(prevState => ({
      modal: !prevState.modal
    }));

    if(checkboxdata.selected!='' && !isNullOrUndefined(checkboxdata.selected)){

        axios.get('http://192.168.0.188:4001/cashreceivable/deposittypedropdown')
        .then(res => {
          const DepType = res.data;
          this.setState({ DepType });
        })
        .catch(function (error) {
          console.log(error);
        });
    
      axios.get('http://192.168.0.188:4001/cashreceivable/bankdropdown')
      .then(res => {
        const Banks = res.data;
        this.setState({ Banks });
      })
      .catch(function (error) {
        console.log(error);
      });
    
        axios.get('http://192.168.0.188:4001/cashreceivable/getselecteddeposit', {
        params:{ 
            id: checkboxdata.selected,
            }
          })
        .then(res => {
          const tSelected = res.data;
          this.setState({ tSelected });
          console.log(tSelected);

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

    viewModal() {
      this.setState(prevState => ({
        modalview: !prevState.modalview
      }));
    }

    closeModal() {
      this.setState(prevState => ({
        triggerModal: !prevState.triggerModal
      }));
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
  
      axios.get('http://192.168.0.188:4001/cashreceivable/getsalescash', {
      params:{ 
          remittance_date: moment(date).format('YYYY-MM-DD')
          }
        })
      .then(res => {
        const tCash = res.data;
        this.setState({ tCash });
        //console.log(tCash);
        console.log(moment(date).format('YYYY-MM-DD'));
      })
      .catch(function (error) {
        console.log(error);
      });  
  
      axios.get('http://192.168.0.188:4001/cashreceivable/getsalesdeposited', {
        params:{ 
            remittance_date: moment(date).format('YYYY-MM-DD')
            }
          })
        .then(res => {
          const tDep = res.data;
          this.setState({ tDep });
          //console.log(tDep);
          console.log(moment(date).format('YYYY-MM-DD'));
        })
        .catch(function (error) {
          console.log(error);
        });
        
        axios.get('http://192.168.0.188:4001/cashreceivable/getsaleswithdrawal', {
          params:{ 
              remittance_date: moment(date).format('YYYY-MM-DD')
              }
            })
          .then(res => {
            const tWith = res.data;
            this.setState({ tWith });
           // console.log(tWith);
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
             selected_ids: e.target.selected_ids.value,
             bal: e.target.bal.value,
             amount: this.state.amount,
             memo: this.state.memo,
             transaction_date: this.state.salesDate,
             date_created: this.state.depositDate,
             transaction_detail_type: this.state.transaction_detail_type,
             aria_trans_gl_code: this.state.aria_trans_gl_code
           };
       
           /*
             var b = new Number(Deposit.bal);
             var a = new Number(Deposit.amount);
             console.log(b);
             console.log(a);
       
             if (a > b) {
              Swal({
                type: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
              })
               //console.log("invalid");
               //alert("invalid");
               this.setState({ visible:true });
               */
            // } else {
               console.log(Deposit);
               axios.post('http://192.168.0.188:4001/cashreceivable/adddeposit', { 
                 bal: Deposit.bal,
                 amount: Deposit.amount,
                 memo: Deposit.memo,
                 transaction_date: moment(this.state.salesDate).format('YYYY-MM-DD'),
                 date_created: moment(this.state.depositDate).format('YYYY-MM-DD'),
                 transaction_detail_type: Deposit.transaction_detail_type,
                 aria_trans_gl_code: Deposit.aria_trans_gl_code,
                 selected_ids: Deposit.selected_ids

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
      //}
    )
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
        axios.delete('http://192.168.0.188:4001/cashreceivable/deletedeposit', {
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

    handleOnSelect = (row, isSelect) => {
      if (isSelect) {
        this.setState(() => ({
          selectedx: [...this.state.selectedx, row.id]
        }));
      } else {
        this.setState(() => ({
          selectedx: this.state.selectedx.filter(x => x !== row.id)
        }));
      }
    }
  
    handleOnSelectAll = (isSelect, rows) => {
      const ids = rows.map(r => r.id);
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
                       //for checkbox
                       const selectRow = {
                        mode: 'checkbox',
                        //clickToSelect: true,
                        bgColor: '#e3ecf4',
                
                        selected: this.state.selectedx,
                        onSelect: this.handleOnSelect,
                        onSelectAll: this.handleOnSelectAll,
                      };

      const customTotal = (from, to, size) => (
        <span className="react-bootstrap-table-pagination-total">
          Showing { from } to { to } of { size } Results
        </span>
      );
      
      const options = {
        paginationSize: 4,
        pageStartIndex: 0,
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
            <IntlProvider locale="en"><FormattedNumber value={cell}/></IntlProvider>
          </span>
        );
    }
   
    function statusFormatter(cell, row) {
        if (row.cleared==1) {
          return (
            <span>
              <span><Badge color="success">CLEARED</Badge></span>
            </span>
          );
        }
         else{

          return (
            <span><Badge color="danger">UNCLEARED</Badge></span>
          );
        }
    }

      function priceFormatter(column, colIndex, { sortElement, filterElement }) {
        return (
          <div style={ { display: 'flex', flexDirection: 'column' } }>
            { filterElement }
            { column.text }
            { sortElement }
          </div>
        );
      }
  
      const { SearchBar } = Search;
      const products =this.state.Deposits;
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
          text: 'OR#',
          sort: true,
          headerSortingStyle,
          align: 'center',
          headerStyle: { backgroundColor: '#84b3ff' },
        // filter: textFilter(),
          headerFormatter: priceFormatter //to put title down
      }, 
      {
          dataField: 'transaction_date',
          text: 'Sales Date',
          sort: true,
          headerSortingStyle,
          formatter: dateFormatter,
          headerStyle: { backgroundColor: '#84b3ff' }
      },
      {
          dataField: 'account_name',
          text: 'Name',
          sort: true,
          headerSortingStyle,
          headerStyle: { backgroundColor: '#84b3ff' }
      }, 
      {
          dataField: 'category_desc',
          text: 'Transaction',
          sort: true,
          headerSortingStyle,
          headerStyle: { backgroundColor: '#84b3ff' }
      }, 
      {
          dataField: 'trans_amount',
          text: 'Amount',
          sort: true,
          headerSortingStyle,
          headerStyle: { backgroundColor: '#84b3ff' }
      }, 
      {
        dataField: 'card_desc',
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
          dataField: 'Void',
          text: 'Void',
          formatter: (cellContent, row) => (
            <Button type="submit" outline color="danger" size="sm" onClick={() => this.handleDelete(row)}><i className="fa fa-pencil-square-o"></i>&nbsp; Void</Button>
          )
    }, 
    {
          dataField: 'View',
          text: 'View',
          formatter: (cellContent, row) => (
            <Button type="submit" outline color="primary" size="sm" onClick={() => this.viewModal(row)}><i className="fa fa-pencil-square-o"></i>&nbsp; View</Button>
          )
    }
   ];
    //<Button type="submit" outline color="danger" size="sm" onClick={() => this.handleDelete(row.id)}><i className="fa fa-trash-o"></i>&nbsp; Remove</Button>
  
    const defaultSorted = [{
      dataField: 'id',
      order: 'asc'
    }];

    if (this.state.toRedirect === true){
      console.log("go1");
      return (
          <Switch>
           <Route path="/cash/cash_receivable" component={Pagis}/>
          </Switch>
          );
        }
        const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
      return (
      <div>

        <Modal isOpen={this.state.modal} toggle={this.toggle} className={'modal-success ' + this.props.className} external={externalCloseBtn}>
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
                          </Col>
                      <Col>

                          {this.state.tSelected.map((tSelected) => <h6>{ "Withdrawal: "+ tSelected._net_amount}</h6>)}

                          <FormGroup>
                          <Input type="hidden" id="bal" name="bal" value={this.state.tCash.map((tCash, i) => tCash.cash) - this.state.tSelected.map((tSelected, i) => tSelected._net_amount)} onChange={this.handleSalesDateChange}/>
                          <Input type="hidden" id="selected_ids" name="selected_ids" value={this.state.selectedx}/>
                          
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
  
                      <Col xs="6">
                            <FormGroup>
                              <Label htmlFor="tendertype">Payment Type:</Label>
                              <Input type="select" name="tendertype" id="tendertype">
                              <option value="1">Cash</option>
                              <option value="2">Check</option>
                              <option value="3">Credit Card</option>
                              <option value="3">Debit Card</option>
                              </Input>
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
                        
                          <Col sm="6">
                          <FormGroup>
                          <Label htmlFor="amount">Amount to Pay:</Label>
                          <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismiss}>
                          The amount entered is greater than remaining balance!
                          </Alert>
                          <Input type="text" id="amount" name="amount" placeholder="Enter Amount.." value={this.state.amount} onChange={this.handleChange}/>
                          </FormGroup>
                          </Col>
                          </Row>
                        <FormGroup row>
                          <Col xs="8">
                          <Label htmlFor="memo">Memo:</Label>
                          <Input type="textarea" name="memo" id="memo" rows="3" placeholder="Enter Memo..." value={this.state.memo} onChange={this.handleChange}/>
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
                        </Form>
                    </CardBody>
                    </Card>
                    </ModalBody>

                  </Modal>

                  <Modal isOpen={this.state.modalview} toggle={this.viewModal}
                         className={'modal-info ' + this.props.className}>
                    <ModalHeader toggle={this.viewModal}>Receivables (Payment History)</ModalHeader>
                    <ModalBody>
                    <Card>
                    <CardHeader>
                      <strong>Transaction History</strong>
                    </CardHeader>
                    <CardBody>
                    </CardBody>
                    </Card>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="secondary" onClick={this.viewModal}>Close</Button>
                    </ModalFooter>
                  </Modal>

          <Row> 
          <Col>
          <Button color="success" className="float-left" onClick={() => this.toggle(selectRow)}><i className="fa fa-plus-square"></i>&nbsp; Reconcile Receivables</Button>
          </Col>
          </Row>
    
          <br/>
          <BootstrapTable  
          selectRow={ selectRow }
          keyField='id' 
          data={ products } 
          columns={ columns } 
          striped
          hover
          //filter={ filterFactory() }
          defaultSorted={ defaultSorted } 
          //search
          pagination={ paginationFactory(options) }
          />
          

      <ToolkitProvider
        keyField="id"
        data={ products }
        columns={ columns }
        search
      >
        {
          props => (
            <div>
              <h3>Input something at below input field:</h3>
              <SearchBar { ...props.searchProps } />
              <hr />
              <BootstrapTable
               selectRow={ selectRow }
                { ...props.baseProps }
                striped
                hover
                //filter={ filterFactory() }
                defaultSorted={ defaultSorted } 
                //search
                pagination={ paginationFactory(options) }
              />
            </div>
          )
        }
      </ToolkitProvider>


      </div>
      )
  }
}

export default withRouter(CashReceivable);