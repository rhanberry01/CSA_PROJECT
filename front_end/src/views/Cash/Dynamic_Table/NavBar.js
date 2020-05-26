import React from 'react';

export class NavBar extends React.Component {
  render() {
    return (
      <Switch>
         <Redirect to="./dynamic_table" Component={CashDeposit}/>
      </Switch>
      );
  }
}
export default withRouter(CashDeposit);