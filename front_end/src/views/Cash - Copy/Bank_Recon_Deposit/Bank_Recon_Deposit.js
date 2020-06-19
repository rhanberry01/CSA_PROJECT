import React, {Component} from 'react';
import { render, findDOMNode } from 'react-dom';
import axios from 'axios';
import { BACKENDIP, BACKENDPORT } from '../../../Database';
import { Badge, Row, Col, Card, CardHeader, CardBody, Button,
Modal, ModalHeader, ModalBody, ModalFooter, Form,FormGroup,Label, Input, Alert,InputGroupText,InputGroup,InputGroupAddon} from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { IntlProvider, FormattedMessage, FormattedNumber } from 'react-intl';
import Spinner from 'react-spinkit';
import Loadable from 'react-loadable';
import { ToastContainer,toast } from 'react-toastify';
import SweetAlert from 'react-bootstrap-sweetalert';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search, CSVExport  } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { isNull, isNullOrUndefined } from 'util';
import { isClass, isClassBody, isClassMethod } from 'babel-types';
//BrowserRouter as Router,
import { Link, Switch, Route, withRouter } from "react-router-dom";
//import { withRouter } from "react-router";

class BankReconDeposit extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
       toRedirect: false,
       dateFrom: moment(),
       dateTo:moment(),
    }
}

render() {
  if (this.state.toRedirect === true){
  console.log("go1");
    return (
      <Switch>
       <Route path="/cash/bank_recon_deposit" component={BankReconDeposit}/>
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
                <i className="fa fa-shopping-cart"></i> Reconcile Deposit
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

      axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/bankrecondeposit/getsalescash')
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
    axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/bankrecondeposit/bankdropdown')
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
        modalAmount:[],
        amount: '',
        tSelected:[],
        selectedx:[],
        selectedy:[],
        selectedyamount:[],
        onSelect:[],
        onSelectAll:[],
        modal: false,
        dateFrom: moment(),
        dateTo:moment(),
      };
  
      this.toggle = this.toggle.bind(this);
      this.viewModal = this.viewModal.bind(this);
      this.openModal = this.openModal.bind(this);
      this.closeModal = this.closeModal.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSalesDateChange = this.handleSalesDateChange.bind(this);
      this.handleDepositDateChange = this.handleDepositDateChange.bind(this);
      this.handledeptypeChange = this.handledeptypeChange.bind(this);
      this.handlebanktypeChange = this.handlebanktypeChange.bind(this);
      this.handleAdd = this.handleAdd.bind(this);
      this.onDismiss = this.onDismiss.bind(this);
      this.handleDateFromChange = this.handleDateFromChange.bind(this);
      this.handleDateToChange = this.handleDateToChange.bind(this);
      this.handleChangestatusType = this.handleChangestatusType.bind(this);
    }

    componentDidMount() {
      axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/bankrecondeposit/getdeposit', {
        params:{ 
            date_from: this.state.dateFrom.subtract(30, 'days').format('YYYY-MM-DD'),
            date_to: this.state.dateTo.format('YYYY-MM-DD'),
          
            }
          })
        .then(res => {
          const Deposits = res.data;
          this.setState({ Deposits });
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
      
            axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/bankrecondeposit/getfilterdeposit', {
             
              params:{ 
                  date_from: moment(this.state.dateFrom).format('YYYY-MM-DD'),
                  date_to: moment(this.state.dateTo).format('YYYY-MM-DD'),
                  status_type: this.state.statusType,
                  }
                })
              .then(res => {
                const Deposits = res.data;
                this.setState({ Deposits });
                console.log("x");
              })
              .catch(function (error) {
                console.log(error);
              }); 
          }      

          handleSearchBank(date) {
            /*
            this.setState({
              date_from: this.state.dateFrom,
              date_to: this.state.dateTo,
              status_type: this.state.statusType,
            });
            */
      
            axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/bankrecondeposit/getfilterbank', {
             
              params:{ 
                  date_from: moment(this.state.dateFrom).format('YYYY-MM-DD'),
                  date_to: moment(this.state.dateTo).format('YYYY-MM-DD'),
                  status_type: this.state.statusType,
                  }
                })
              .then(res => {
                const Banks = res.data;
                this.setState({ Banks });
                console.log("x");
              })
              .catch(function (error) {
                console.log(error);
              }); 
          }      

    toggle(checkboxdata) {

      if (checkboxdata.selected=="") {
        
             Swal({
               type: 'error',
               title: 'Oops...',
               text: 'No transaction has been selected to reconcile.',
             })
              //console.log("invalid");
              //alert("invalid");
     
              return;
           }

        axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/bankrecondeposit/getbank', {
          params:{ 
              date_from: this.state.dateFrom.subtract(30, 'days').format('YYYY-MM-DD'),
              date_to: this.state.dateTo.format('YYYY-MM-DD'),
            
              }
            })
          .then(res => {
            const Banks = res.data;
            this.setState({ Banks });
            console.log(Banks);
          })
          .catch(function (error) {
            console.log(error);
          });


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

        axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/bankrecondeposit/deposittypedropdown')
        .then(res => {
          const DepType = res.data;
          this.setState({ DepType });
        })
        .catch(function (error) {
          console.log(error);
        });
    
      axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/bankrecondeposit/bankdropdown')
      .then(res => {
        const Banks = res.data;
        this.setState({ Banks });
      })
      .catch(function (error) {
        console.log(error);
      });
    
        axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/bankrecondeposit/getselecteddeposit', {
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


    viewModal() {
      this.setState(prevState => ({
        modalview: !prevState.modalview
      }));
    }

    openModal() {
      this.setState(prevState => ({
        modal: !prevState.modal
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
  
    handleDateFromChange (date) {
      this.setState({
        dateFrom: date
      });
    }

    handleDateToChange (date) {
      this.setState({
        dateTo: date
      });
    }

    handleChangestatusType (e) {
      this.setState({
        statusType: e.target.value
      });
    }

    handleSalesDateChange (date) {
      this.setState({
        salesDate: date
      });
  
      axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/bankrecondeposit/getsalescash', {
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
  
      axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/bankrecondeposit/getsalesdeposited', {
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
        
        axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/bankrecondeposit/getsaleswithdrawal', {
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
             selected_book_ids: e.target.selected_book_ids.value,
             selected_bank_ids: e.target.selected_bank_ids.value,
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
       
              if (Number(a) > Number(b)) {
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
               console.log(Deposit.selected_book_ids);
               console.log(Deposit.selected_bank_ids);

               axios.put('http://'+BACKENDIP+':'+BACKENDPORT+'/bankrecondeposit/adddeposit', { 
                 bal: Deposit.bal,
                 amount: Deposit.amount,
                 memo: Deposit.memo,
                 transaction_date: moment(this.state.salesDate).format('YYYY-MM-DD'),
                 date_created: moment(this.state.depositDate).format('YYYY-MM-DD'),
                 transaction_detail_type: Deposit.transaction_detail_type,
                 aria_trans_gl_code: Deposit.aria_trans_gl_code,
                 selected_book_ids: Deposit.selected_book_ids,
                 selected_bank_ids: Deposit.selected_bank_ids

               })
               .then(res => {
                
                 console.log(res);
                 console.log(res.data);
                 /*
                 Swal(
                   'Successful!',
                   'Your deposit has been Added.',
                   'success'
                 );
                 */

                 Swal.fire({
                  position: 'center',
                  type: 'success',
                  title: 'Transaction has been Added.',
                  showConfirmButton: false,
                  timer: 2000
                })

                // this.props.history.push("/sales/sales_audit")
                this.setState({ toRedirect:true });
               })
             }
       }
      //}
    )
      }

  //------------------------------------------------------------
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
        axios.delete('http://'+BACKENDIP+':'+BACKENDPORT+'/bankrecondeposit/deletedeposit', {
        data:{ 
            id: Deposit.id
          }
        })
        .then(res => {
          //console.log(res);
          //console.log(res.data);
          this.setState({ toRedirect:true });
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

    handleOnModalSelect = (row, isSelect) => {
      if (isSelect) {
        this.setState(() => ({
          selectedy: [...this.state.selectedy, row.id],
          selectedyamount: [...this.state.selectedyamount, row.credit_amount],
        }));
      } else {
        this.setState(() => ({
          selectedy: this.state.selectedy.filter(x => x !== row.id)
        }));
      }
    }
  
    handleOnModalSelectAll = (isSelect, rows) => {
      const ids = rows.map(r => r.id);
      const idsamount = rows.map(r => r.credit_amount);

      if (isSelect) {
        this.setState(() => ({
          selectedy: ids,
          selectedyamount: idsamount
        }));
      } else {
        this.setState(() => ({
          selectedy: [],
          selectedyamount: []
        }));
      }
    }

    render() {
      //for checkbox

      //start of disable checkbox
      /*
      var Disabled = this.state.Deposits.filter(function (selecteddisabled) {
      return selecteddisabled.paid == 1;
      });
      */
      const getDisabled = this.state.Deposits.filter(rec => rec.reconciled === 1);
      console.log(getDisabled);

      var arrDisabled = getDisabled.map(function (mylist) {
        return mylist.id;
      });
      //end of to disable textbox

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
        if (row.reconciled===1) {
          return (
            <span>
              <span><Badge color="success">Reconciled</Badge></span>
            </span>
          );
        }
         else{

          return (
            <span><Badge color="danger">Unreconciled</Badge></span>
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
      const { ExportCSVButton } = CSVExport;

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
          dataField: 'transaction_date',
          text: 'Date',
          sort: true,
          headerSortingStyle,
          formatter: dateFormatter,
          headerStyle: { backgroundColor: '#84b3ff' }
      },
      {
          dataField: 'memo_',
          text: 'Remarks',
          sort: true,
          headerSortingStyle,
          headerStyle: { backgroundColor: '#84b3ff' }
      }, 
      {
        dataField: 'transaction_type',
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
      order: 'desc'
    }];


//MODAL BANK TABLE PROPERTIES
function ModalstatusFormatter(cell, row) {
  if (row.cleared===1) {
    return (
      <span>
        <span><Badge color="success">Reconciled</Badge></span>
      </span>
    );
  }
   else{

    return (
      <span><Badge color="danger">Unreconciled</Badge></span>
    );
  }
}

    const getDisabledModal = this.state.Banks.filter(rec => rec.cleared === 1);
    console.log(getDisabledModal);

    var arrDisabledModal = getDisabledModal.map(function (mylist) {
    return mylist.id;
    });

    const selectRowy = {
      mode: 'checkbox',
      //clickToSelect: true,
      bgColor: '#e3ecf4',

      selected: this.state.selectedy,
      onSelect: this.handleOnModalSelect,
      onSelectAll: this.handleOnModalSelectAll,
      nonSelectable: arrDisabledModal
    };

    const bank =this.state.Banks;
    const modal_table_columns = [
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
        dataField: 'date_deposited',
        text: 'Date',
        sort: true,
        headerSortingStyle,
        formatter: dateFormatter,
        headerStyle: { backgroundColor: '#84b3ff' }
    },
    {
        dataField: 'bank_ref_num',
        text: 'Reference',
        sort: true,
        headerSortingStyle,
        headerStyle: { backgroundColor: '#84b3ff' }
    }, 
    {
      dataField: 'credit_amount',
      text: 'Amount',
      sort: true,
      headerSortingStyle,
      formatter: amountFormatter,
      headerStyle: { backgroundColor: '#84b3ff' }
    },

    {
        dataField: 'reconciled',
        text: 'Status',
        formatter: ModalstatusFormatter,
        headerStyle: { backgroundColor: '#84b3ff' }
        
    }, 
    {
        dataField: 'Void',
        text: 'Unrecon',
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

 const modal_table_options = {
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


    if (this.state.toRedirect === true){
      console.log("go1");
      return (
          <Switch>
           <Route path="/cash/bank_recon_deposit" component={Pagis}/>
          </Switch>
          );
        }
        const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
       
        //const a = this.state.tSelected.map((tSelected) => tSelected._net_amount);
        const totalselectedx = this.state.tSelected.reduce((accumulator, tSelected) => accumulator + tSelected._net_amount, 0);
        
        const totalselectedy = this.state.tSelected.reduce((accumulator, tSelected) => accumulator + tSelected.credit_amount, 0);
       

       return (
        <div>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={'modal-lg ' + this.props.className} external={externalCloseBtn} backdrop="static">
                    <ModalHeader toggle={this.toggle}>Bank Statement</ModalHeader>
                    <ModalBody>
                    <Card>
                    <CardHeader>
                      <strong>Reconcile Deposit</strong>
                    </CardHeader>
                    <CardBody>
                      <Form onSubmit={this.handleAdd}>

                      <Row>
                      <Col>
                        {<h6>Book Transaction #: {this.state.selectedx.join(',')}</h6>}
                      </Col>
                      <Col>
                      <h6>Book Total: </h6>
                      <IntlProvider locale="en">
                      <FormattedNumber value={totalselectedx}/>
                      </IntlProvider>
                      <FormGroup>
                      <Input type="hidden" id="bal" name="bal" value={this.state.tCash.map((tCash, i) => tCash.cash) - this.state.tSelected.map((tSelected, i) => tSelected._net_amount)} onChange={this.handleSalesDateChange}/>
                      <Input type="hidden" id="selected_book_ids" name="selected_book_ids" value={this.state.selectedx}/>
                      </FormGroup>
                       </Col>
                       </Row>

                      <Row>
                      <Col>
                        {<h6>Bank Transaction #: {this.state.selectedy.join(',')}</h6>}
                      </Col>
                      <Col>
                      {<h6>Sub Total #: {this.state.selectedyamount.join(',')}</h6>}
                      <h6>Bank Total: </h6>
                      <IntlProvider locale="en">
                      <FormattedNumber value={this.state.selectedyamount}/>
                      </IntlProvider>
                      <FormGroup>
                      <Input type="hidden" id="bal" name="bal" value={this.state.tCash.map((tCash, i) => tCash.cash) - this.state.tSelected.map((tSelected, i) => tSelected._net_amount)} onChange={this.handleSalesDateChange}/>
                      <Input type="hidden" id="selected_bank_ids" name="selected_bank_ids" value={this.state.selectedy}/>
                      </FormGroup>
                       </Col>
                       </Row>

                      <Row>
                      <ToolkitProvider
                        keyField="id"
                        data={ bank }
                        columns={ modal_table_columns }
                        search
                        exportCSV={ {
                          fileName: 'bankrecondeposit.csv'
                        } }
                      >
                      {
                      props => (
                          <div>
                        {/* START OF FILTER */}
                      <Row> 
                        <Col>
                        <Label htmlFor="depositDate">From Date:</Label>
                        <DatePicker selected={this.state.dateFrom} onChange={this.handleDateFromChange} maxDate={moment()}/> 
                        </Col>
                        <Col>
                        <Label htmlFor="depositDate">To Date:</Label>
                        <DatePicker selected={this.state.dateTo} onChange={this.handleDateToChange} maxDate={moment()}/> 
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
                        <br/>
                        <Button color="secondary" className="float-left" onClick={() => this.handleSearchBank()}><i className="fa fa-filter"></i>&nbsp; Filter</Button>
                        </Col>
                        </Row>
                        <hr />
                        {/* END OF FILTER */}

                        {/* START OF SEARCH */}
                        <Row>
                        <Col sm="6">
                        <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa fa-search"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <SearchBar { ...props.searchProps } placeholder="Find what...?"/>
                        </InputGroup>
                        </Col>
                        </Row>
                        {/* END OF SEARCH */}

                          {/* START OF TABLE*/}
                          <BootstrapTable
                          bootstrap4
                            selectRow={ selectRowy }
                            { ...props.baseProps }
                            striped
                            hover
                            //filter={ filterFactory() }
                            defaultSorted={ defaultSorted } 
                            //search
                            pagination={ paginationFactory(modal_table_options) }
                          />
                        <hr />
                        {/* END OF TABLE*/}
                        </div>
                        )
                        }
                      </ToolkitProvider>   {/* END OF TABLE ToolkitProvider w/ check row*/}

                        </Row>
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
                         className={'modal-info ' + this.props.className} backdrop="static">
                    <ModalHeader toggle={this.viewModal}>Withdrawal (Payment History)</ModalHeader>
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
        
      {/* START OF TABLE ToolkitProvider w/ check row*/}
      <ToolkitProvider
      keyField="id"
      data={ products }
      columns={ columns }
      search
      exportCSV={ {
        fileName: 'bankrecondeposit.csv'
      } }
      >

      {
        props => (
          <div>
        {/* START OF FILTER */}
       <Row> 
        <Col>
        <Label htmlFor="depositDate">From Date:</Label>
         <DatePicker selected={this.state.dateFrom} onChange={this.handleDateFromChange} maxDate={moment()}/> 
         </Col>
         <Col>
        <Label htmlFor="depositDate">To Date:</Label>
         <DatePicker selected={this.state.dateTo} onChange={this.handleDateToChange} maxDate={moment()}/> 
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
         <br/>
        <Button color="secondary" className="float-left" onClick={() => this.handleSearch()}><i className="fa fa-filter"></i>&nbsp; Filter</Button>
        </Col>
        </Row>
        <hr />
        {/* END OF FILTER */}


         {/* START OF SEARCH */}
        <Row>
        <Col sm="6">
        <Button color="success" className="float-left" onClick={() => this.toggle(selectRow)}><i className="fa fa-plus-square"></i>&nbsp; Find in Bank Statement </Button>
        </Col>

        <Col sm="6">
        <InputGroup className="mb-3">
        <InputGroupAddon addonType="prepend">
          <InputGroupText>
            <i className="fa fa-search"></i>
          </InputGroupText>
        </InputGroupAddon>
        <SearchBar { ...props.searchProps } placeholder="Find what...?"/>
        </InputGroup>
        </Col>
        </Row>
        {/* END OF SEARCH */}

            {/* START OF TABLE*/}
            <BootstrapTable
            bootstrap4
             selectRow={ selectRow }
              { ...props.baseProps }
              striped
              hover
              //filter={ filterFactory() }
              defaultSorted={ defaultSorted } 
              //search
              pagination={ paginationFactory(options) }
            />
          <hr />
          <ExportCSVButton { ...props.csvProps }>Export to CSV</ExportCSVButton>
         {/* END OF TABLE*/}
         
          </div>
        )
      }

      </ToolkitProvider>   {/* END OF TABLE ToolkitProvider w/ check row*/}

      </div>
      )
  }
}

export default withRouter(BankReconDeposit);