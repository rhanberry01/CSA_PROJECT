import React, {Component} from 'react';
import { render, findDOMNode } from 'react-dom';
import axios from 'axios';
import { Badge, Row, Col, Card, CardHeader, CardBody, Button,
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

//-----START OF TABLE PART
loadDeposits() {
  axios.get('http://192.168.0.188:4001/otherdeposit/getdeposit')
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

closeModal() {
  this.setState({
    large: !this.state.large,
  });
}

//----START OF ADD PART
openAddModal() {
console.log("clicked.");
this.setState({
 large: !this.state.large
});

axios.get('http://192.168.0.188:4001/otherdeposit/deposittypedropdown')
.then(res => {
 const DepType = res.data;
 this.setState({ DepType });
})
.catch(function (error) {
 console.log(error);
});

axios.get('http://192.168.0.188:4001/otherdeposit/bankdropdown')
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

axios.get('http://192.168.0.188:4001/otherdeposit/getsalescash', {
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

axios.get('http://192.168.0.188:4001/otherdeposit/getsalesdeposited', {
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
 
 axios.get('http://192.168.0.188:4001/otherdeposit/getsaleswithdrawal', {
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
 
       if (a > b) {
        Swal({
          type: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
         //console.log("invalid");
         //alert("invalid");
         this.setState({ visible:true });
       } else {
         console.log(Deposit);
         axios.post('http://192.168.0.188:4001/otherdeposit/adddeposit', { 
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
       <Route path="/cash/other_deposit" component={OtherDeposit}/>
      </Switch>
      );
    }
  else{
  console.log("go2");
    return (
  <div className="animated fadeIn">
    <Row>
      <Col>           
            <Modal isOpen={this.state.large} toggle={this.openAddModal}
                   className={'modal-lg ' + this.props.className}>
              <ModalHeader toggle={this.openAddModal}>Other Deposit</ModalHeader>
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
                    <Input type="number" id="amount" name="amount" placeholder="Enter Amount.." value={this.state.amount} onChange={this.handleChange}/>
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

      axios.get('http://192.168.0.188:4001/otherdeposit/getsalescash')
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
    axios.get('http://192.168.0.188:4001/otherdeposit/bankdropdown')
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
    }
  
    componentDidMount() {
      axios.get('http://192.168.0.188:4001/otherdeposit/getdeposit')
        .then(res => {
          const Deposits = res.data;
          this.setState({ Deposits });
          console.log(Deposits);
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
        transaction_detail_type:Depositdata.transaction_type,
      });
  
      axios.get('http://192.168.0.188:4001/otherdeposit/deposittypedropdown')
      .then(res => {
        const DepType = res.data;
        this.setState({ DepType });
      })
      .catch(function (error) {
        console.log(error);
      });
  
    axios.get('http://192.168.0.188:4001/otherdeposit/bankdropdown')
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
  
      axios.get('http://192.168.0.188:4001/otherdeposit/getsalescash', {
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
  
      axios.get('http://192.168.0.188:4001/otherdeposit/getsalesdeposited', {
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
        
        axios.get('http://192.168.0.188:4001/otherdeposit/getsaleswithdrawal', {
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
        id: this.state.idx,
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
          axios.put('http://192.168.0.188:4001/otherdeposit/updatedeposit', { 
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
        axios.delete('http://192.168.0.188:4001/otherdeposit/deletedeposit', {
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
      console.log(this.state.idx);
      const customTotal = (from, to, size) => (
        <span className="react-bootstrap-table-pagination-total">
          Showing { from } to { to } of { size } Results
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
            <IntlProvider locale="en"><FormattedNumber value={cell}/></IntlProvider>
          </span>
        );
    }
   
    function statusFormatter(cell, row) {
      /*
      if (row.status) {
        return (
          <span>
            <strong style={ { color: 'red' } }>$ { cell } NTD(Sales!!)</strong>
          </span>
        );
      }
      */
    
      return (
        <span><Badge color="danger">UNRECONCILED</Badge></span>
      );
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
  
      //const { SearchBar } = Search;
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
          text: 'Sales Date',
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
           <Route path="/cash/other_deposit" component={Pagis}/>
          </Switch>
          );
        }
 
      return (
      <div>
        <Modal isOpen={this.state.large} toggle={this.openModal} className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={this.openModal}>Other Deposit</ModalHeader>
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
                          <DatePicker selected={this.state.salesDate} onChange={this.handleSalesDateChange} maxDate={moment()} minDate={moment().subtract(5, "days")}/> 
                          </FormGroup>
                          </Col>
                          <Col xs="6">

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
                          <Input type="number" id="amount" name="amount" placeholder="Enter Amount.." value={this.state.amount} onChange={this.handleChange}/>
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
                    </ModalBody>
                    <ModalFooter>
                      <Button color="secondary" onClick={this.closeModal}>Close</Button>
                    </ModalFooter>
                  </Modal>
  
          <BootstrapTable  
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

      </div>
      )
    }
  }

export default withRouter(OtherDeposit);