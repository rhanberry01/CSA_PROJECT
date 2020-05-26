import React from 'react';
import Loadable from 'react-loadable'

import DefaultLayout from './containers/DefaultLayout';
import Spinner from 'react-spinkit';

function Loading() {
  return <div>Loading...
  <Spinner name="ball-spin-fade-loader" color="steelblue"/>
  </div>;
}

const Cash_Deposit = Loadable({
  loader: () => import('./views/Cash/Cash_Deposit'),
  loading: Loading,
});

const Other_Deposit = Loadable({
  loader: () => import('./views/Cash/Other_Deposit'),
  loading: Loading,
});

const Cash_Receivable = Loadable({
  loader: () => import('./views/Cash/Cash_Receivable'),
  loading: Loading,
});

const Sales_Audit = Loadable({
  loader: () => import('./views/Cash/Sales_Audit'),
  loading: Loading,
});

const Sales_Breakdown = Loadable({
  loader: () => import('./views/Cash/Sales_Breakdown'),
  loading: Loading,
});


const Dynamic_Table = Loadable({
  loader: () => import('./views/Cash/Dynamic_Table'),
  loading: Loading,
});

const Cash_Withdrawal = Loadable({
  loader: () => import('./views/Cash/Cash_Withdrawal'),
  loading: Loading,
});

const Recon_Withdrawal = Loadable({
  loader: () => import('./views/Cash/Recon_Withdrawal'),
  loading: Loading,
});

const Bank_Recon_Deposit = Loadable({
  loader: () => import('./views/Cash/Bank_Recon_Deposit'),
  loading: Loading,
});

const Redirection = Loadable({
  loader: () => import('./views/Cash/Redirection'),
  loading: Loading,
});


const Dashboard = Loadable({
  loader: () => import('./views/Dashboard'),
  loading: Loading,
});

const Users = Loadable({
  loader: () => import('./views/Users/Users'),
  loading: Loading,
});

const User = Loadable({
  loader: () => import('./views/Users/User'),
  loading: Loading,
});



// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/cash/cash_deposit', name: 'Cash Deposit', component: Cash_Deposit },
  { path: '/cash/other_deposit', name: 'Other Deposit', component: Other_Deposit },
  { path: '/cash/cash_receivable', name: 'Cash Receivable', component: Cash_Receivable },
  { path: '/cash/sales_breakdown', name: 'Sales Breakdown', component: Sales_Breakdown },
  { path: '/cash/sales_audit', name: 'Sales Audit', component: Sales_Audit },
  { path: '/cash/dynamic_table', name: 'Dynamic Table', component: Dynamic_Table },
  { path: '/cash/cash_withdrawal', name: 'Cash Withdarawal', component: Cash_Withdrawal },
  { path: '/cash/recon_withdrawal', name: 'Recon Withdarawal', component: Recon_Withdrawal },
  { path: '/cash/bank_recon_deposit', name: 'Reconcile Deposit', component: Bank_Recon_Deposit },
  { path: '/cash/Redirection', name: 'Redirection', component: Redirection },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/users', exact: true,  name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },
];

export default routes;
