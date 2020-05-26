var express = require('express');
var router = express.Router();

router.get('/getdeposit', function(req, res, next) {

  if(req.query.status_type==1){
    var qry=`and reconciled= 0`;
  }
  else if(req.query.status_type==2){
    var qry=`and reconciled= 1`;
  }
  else {
    var qry=`and reconciled IN (0,1)`;
  }

  res.locals.mysql_connection_91.query(
    `SELECT * FROM 0_central_sales_audit_header
    WHERE transaction_date>= '`+req.query.date_from+`'
    AND transaction_date<= '`+req.query.date_to+`'
    `+qry+`
    AND branch_code='srsn'
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
    var qry=`and reconciled= 0`;
  }
  else if(req.query.status_type==2){
    var qry=`and reconciled= 1`;
  }
  else {
    var qry=`and reconciled IN (0,1)`;
  }

  //WHERE cd_sales_date>= '`+req.query.date_from+`'
  //AND cd_sales_date<= '`+req.query.date_to+`'
  res.locals.mysql_connection_91.query(
   `SELECT * FROM 0_central_sales_audit_header
   WHERE transaction_date>= '`+req.query.date_from+`'
   AND transaction_date<= '`+req.query.date_to+`'
   `+qry+`
   AND branch_code='srsn'
   ORDER BY transaction_date desc
   `, 
  function (error, results, fields) {if(error) throw error;
   res.send(JSON.stringify(results));
 });
 res.locals.mysql_connection_91.end();
}
);

router.get('/getbank', function(req, res, next) {
  
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
      `SELECT * FROM cash_deposit2.0_bank_statement_aub
      WHERE date_deposited>= '`+req.query.date_from+`'
      AND date_deposited<= '`+req.query.date_to+`'
      `+qry+`
      AND credit_amount!=0
      ORDER BY date_deposited desc
      `, 
     function (error, results, fields) {if(error) throw error;
      res.send(JSON.stringify(results));
    });
    res.locals.mysql_connection_91.end();
  }
  );
  
  router.get('/getfilterbank', function(req, res, next) {
  
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
     `SELECT * FROM cash_deposit2.0_bank_statement_aub
     WHERE date_deposited>= '`+req.query.date_from+`'
     AND date_deposited<= '`+req.query.date_to+`'
     `+qry+`
      AND credit_amount!=0
     ORDER BY date_deposited desc
     `, 
    function (error, results, fields) {if(error) throw error;
     res.send(JSON.stringify(results));
   });
   res.locals.mysql_connection_91.end();
  }
  );


router.get('/getselecteddeposit', function(req, res, next) {
  res.locals.mysql_connection_91.query(
    `SELECT * FROM 0_central_sales_audit_header where id IN (`+req.query.id+`)`, 
function (error, results, fields) {if(error) throw error;
   res.send(JSON.stringify(results));
  //console.log(req.query);
  //console.log(`SELECT * FROM 0_central_sales_audit_header where id IN (`+req.query.id+`)`);
 });
}
);

router.put('/adddeposit', function(req, res, next) {
      res.locals.mysql_connection_91.query(`UPDATE cash_deposit2.0_central_sales_audit_header SET reconciled= 1, bank_statement_id=` +req.body.selected_bank_ids+ ` WHERE id IN (` +req.body.selected_book_ids+ `)`, function (error, results, fields) {
      if(error) throw error;
      //console.log(results.insertId);
      
      res.locals.mysql_connection_91.query(`UPDATE cash_deposit2.0_bank_statement_aub SET cleared= 1, reference=` +req.body.selected_book_ids+ ` WHERE id IN (` +req.body.selected_bank_ids+ `)`, 
      function (error, results, fields) {
      if(error) throw error;
      //console.log(req.body.selected_ids);
      res.send(JSON.stringify(results));
      }); 

  });



});

router.put('/updatedeposit', function(req, res, next) {
  res.locals.mysql_connection_91.query("UPDATE cash_deposit2.0_central_sales_audit_header SET _net_amount= '"+req.body.amount+"' where id = '"+req.body.id+"'", function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  }); 
});

router.delete('/deletedeposit', function(req, res, next) {
  res.locals.mysql_connection_91.query("DELETE FROM cash_deposit2.0_central_sales_audit_header where id = '"+req.body.id+"'", function (error, results, fields) {
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
  res.locals.mysql_connection_91.query("SELECT type, name FROM cash_deposit2.0_cash_transaction_type where action=1 and type not in (201,202,203) and inactive=0", function (error, results, fields) {
   if(error) throw error;
   res.send(JSON.stringify(results));
 });
});

router.get('/getsalescash', function(req, res, next) {
  res.locals.mysql_connection_91.query("select sum(total_cash) as cash from cashier_remittance.0_remittance_summary where r_summary_date = '"+req.query.remittance_date+"'", function (error, results, fields) {
   if(error) throw error;
   res.send(JSON.stringify(results));
   //console.log(req.query.remittance_date);
 });
});

router.get('/getsalesdeposited', function(req, res, next) {
  res.locals.mysql_connection_91.query("SELECT sum(_net_amount) as cash FROM cash_deposit2.0_central_sales_audit_header where process_type=1 and transaction_type=61 and transaction_date= '"+req.query.remittance_date+"'", function (error, results, fields) {
   if(error) throw error;
   res.send(JSON.stringify(results));
   //console.log(req.query.remittance_date);
 });
});

router.get('/getsaleswithdrawal', function(req, res, next) {
  res.locals.mysql_connection_91.query("SELECT sum(_net_amount) as cash FROM cash_deposit2.0_sales_withdrawal where transaction_date= '"+req.query.remittance_date+"'", function (error, results, fields) {
   if(error) throw error;
   res.send(JSON.stringify(results));
   //console.log(req.query.remittance_date);
 });
});

module.exports = router;