var express = require('express');
var router = express.Router();

router.get('/getdeposit', function(req, res, next) {
  if(req.query.status_type==1){
    var qry=`and cleared= 0`;
  }
  else if(req.query.status_type==2){
    var qry=`and cleared= 1`;
  }
  else {
    var qry=`and cleared IN (0,1)`;
  }

  res.locals.mysql_connection_91.query(
    `SELECT * FROM 0_sales_withdrawal
    WHERE transaction_date>= '`+req.query.date_from+`'
    AND transaction_date<= '`+req.query.date_to+`'
    AND branch_code='`+req.session.branch+`'
    `+qry+`
    ORDER BY transaction_date desc
    `, 
   function (error, results, fields) {if(error) throw error;
    res.send(JSON.stringify(results));
  });
  res.locals.mysql_connection_91.end();
}
);

router.get('/getfilterdeposit', function(req, res, next) {

  if(req.query.status_type==1){
    var qry=`and cleared= 0`;
  }
  else if(req.query.status_type==2){
    var qry=`and cleared= 1`;
  }
  else {
    var qry=`and cleared IN (0,1)`;
  }

  res.locals.mysql_connection_91.query(
   `SELECT * FROM 0_sales_withdrawal
   WHERE transaction_date>= '`+req.query.date_from+`'
   AND transaction_date<= '`+req.query.date_to+`'
   AND branch_code='`+req.session.branch+`'
   `+qry+`
   ORDER BY transaction_date desc
   `, 
  function (error, results, fields) {if(error) throw error;
   res.send(JSON.stringify(results));
 });
 res.locals.mysql_connection_91.end();
}
);

router.post('/adddeposit', function(req, res, next) {
  res.locals.mysql_connection_91.query(`INSERT INTO cash_deposit2.0_sales_withdrawal 
  (_net_amount,memo_,transaction_date,date_created,transaction_type,branch_code,created_by) 
  VALUES('`+req.body.amount+ `', '`+req.body.memo+ `', '`+req.body.transaction_date+`',
  '`+req.body.date_created+`', '`+req.body.transaction_detail_type+`','`+req.session.branch+ `','`+req.session.userId+ `')`, 
  function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

router.put('/updatedeposit', function(req, res, next) {
  res.locals.mysql_connection_91.query(`UPDATE cash_deposit2.0_sales_withdrawal 
  SET _net_amount= '`+req.body.amount+`', 
  transaction_type= '`+req.body.transaction_detail_type+`', 
  memo_= '`+req.body.memo+`'
  where id = '`+req.body.id+`' `,
  function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  }); 
});

router.delete('/deletedeposit', function(req, res, next) {
  res.locals.mysql_connection_91.query("DELETE FROM cash_deposit2.0_sales_withdrawal where id = '"+req.body.id+"'", function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
      //console.log(req.query.id);
  }); 
});

/* GET Bank Account listing. */
router.get('/bankdropdown', function(req, res, next) {
  res.locals.mysql_connection_91.query("SELECT account_code, bank_account_name FROM cash_deposit2.0_all_bank_accounts", function (error, results, fields) {
   if(error) throw error;
   res.send(JSON.stringify(results));
 });
});

/* GET Bank Account listing. */
router.get('/deposittypedropdown', function(req, res, next) {
  res.locals.mysql_connection_91.query("SELECT type, name FROM cash_deposit2.0_cash_transaction_type where action=1 and type in (207, 208, 209, 217, 218, 221) and inactive=0", function (error, results, fields) {
   if(error) throw error;
   res.send(JSON.stringify(results));
 });
});


router.get('/getsalesdeposited', function(req, res, next) {
  res.locals.mysql_connection_91.query("SELECT sum(_net_amount) as cash FROM cash_deposit2.0_central_sales_audit_header where transaction_type IN (201,202,203) and transaction_date= '"+req.query.remittance_date+"' and branch_code= '"+req.session.branch+"'", function (error, results, fields) {
   if(error) throw error;
   res.send(JSON.stringify(results));
   //console.log(req.query.remittance_date);
 });
});

router.get('/getsaleswithdrawal', function(req, res, next) {
  res.locals.mysql_connection_91.query("SELECT sum(_net_amount) as cash FROM cash_deposit2.0_sales_withdrawal where transaction_date= '"+req.query.remittance_date+"' and branch_code= '"+req.session.branch+"'", function (error, results, fields) {
   if(error) throw error;
   res.send(JSON.stringify(results));
   //console.log(req.query.remittance_date);
 });
});

router.get('/getsalescash', function(req, res, next) {
  res.locals.remittance_connection.query("select sum(total_cash) as cash from 0_remittance_summary where r_summary_date = '"+req.query.remittance_date+"'", function (error, results, fields) {
   if(error) throw error;
   res.send(JSON.stringify(results));
   //console.log(req.query.remittance_date);
 });
});

module.exports = router;