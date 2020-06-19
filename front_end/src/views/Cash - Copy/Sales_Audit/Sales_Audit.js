import React, { Component } from 'react';
import { render } from 'react-dom';
import { Button, Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import axios from 'axios';
import { BACKENDIP, BACKENDPORT } from '../../../Database';

import Swal from 'sweetalert2'

class Sales_Audit extends Component {
  render() {
    return (
      <div className="animated fadeIn">
      <Card>
        <CardHeader>
          <i className="fa fa-shopping-cart"></i> Cash Deposit (Sales)
        </CardHeader>
        <CardBody>
        <Pagis/>
        </CardBody>
      </Card>
      </div>

    );
  }
}

class Pagis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       Deposits: [],
       id: '',
    }
 }

 componentDidMount() {
  axios.get('http://'+BACKENDIP+':'+BACKENDPORT+'/cashdeposit/getdeposit')
    .then(res => {
      const Deposits = res.data;
      this.setState({ Deposits });
      console.log(Deposits);
    })
    .catch(function (error) {
      console.log(error);
    });
}

handleDelete(Depositdata) {
  const Deposit = {
    id: Depositdata.id
  };
console.log(Depositdata);
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
    const headerSortingStyle = { backgroundColor: '#5b9aff' };
    const columns = [{
      dataField: 'id',
      text: 'ID',
      sort: true,
      headerSortingStyle,
      align: 'center',
      headerStyle: { backgroundColor: '#84b3ff' },
     // filter: textFilter(),
      headerFormatter: priceFormatter //to put title down
    }, {
      dataField: 'transaction_type',
      text: 'Type',
      sort: true,
      headerSortingStyle,
      headerStyle: { backgroundColor: '#84b3ff' }
    }, {
      dataField: 'memo_',
      text: 'Memo',
      sort: true,
      headerSortingStyle,
      headerStyle: { backgroundColor: '#84b3ff' }
    }, {
        dataField: 'inStock',
        text: 'In Stock',
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

    return (
    <div>
      
        {/*this.state.Deposits.map((deposit_row, index) => (
        <p>Hello, {deposit_row.id} from {deposit_row.transaction_type}!</p>
        ))*/}
        <Button color="success" ><i className="fa fa-plus-square"></i>&nbsp; Add</Button>
        <Button color="primary" ><i className="fa fa-plus-square"></i>&nbsp; Edit</Button>
        <Button color="danger" className="float-right"><i className="fa fa-plus-square"></i>&nbsp; Remove</Button>

        <BootstrapTable  
        keyField='id' 
        data={ products } 
        columns={ columns } 
        striped
        hover
        //filter={ filterFactory() }
        defaultSorted={ defaultSorted } 
        search
        />

    </div>
    )
  }
}

export default Sales_Audit;
