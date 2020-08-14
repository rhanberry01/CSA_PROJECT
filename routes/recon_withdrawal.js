var express = require('express');
var router = express.Router();
var math = require('mathjs');
var _ = require('lodash');

router.get('/getdeposit', function (req, res, next) {

  function get_paid(rows) {

    var total_query = `SELECT sum(_net_amount) as total,sum(_oi_amount) as _oi_amount FROM cash_deposit2.0_central_sales_audit_header WHERE transaction_type='222' 
          AND branch_code='`+ req.session.branch + `' AND aria_trans_nos IN(` + rows + `)`;
    //console.log('query: ', total_query);
    return new Promise(function (resolve, reject) {
      res.locals.aria_connection.query(total_query, (total_err, total_rows) => {
        if (total_err) {
          reject(total_err);
        }
        else {
          for (var i in total_rows) {
            // console.log('Result: ', total_rows[i].total);
            resolve(total_rows);
          }
          // console.log(total_rows + `total rows`);
        }

      });
    });
  }
  //=============================================================
  if (req.query.status_type == 1) {
    var qry = `and cleared= 0`;
  }
  else if (req.query.status_type == 2) {
    var qry = `and cleared= 1`;
  }
  else {
    var qry = `and cleared IN (0,1)`;
  }

  /* var queryString = `SELECT * FROM cash_deposit2.0_sales_withdrawal
               WHERE transaction_date>= '`+ req.query.date_from + `'
               and transaction_date<= '`+ req.query.date_to + `'
               AND branch_code='`+ req.session.branch + `'
               `+ qry + ` ORDER BY transaction_date desc`;*/

  var queryString = `SELECT 
              group_concat(memo_) as memo_ ,  
              group_concat(id) as id ,
              SUM(_net_amount) as _net_amount,
              max(cleared) as cleared,
              group_concat(date_created) as date_created,
              group_concat(transaction_date) as transaction_date,
              CASE WHEN group_id	is null THEN id ELSE group_id END as group_ids
              FROM cash_deposit2.0_sales_withdrawal
              WHERE branch_code='`+ req.session.branch + `' ` + qry + `
              and  cast(lastdatemodified as date) = CURRENT_DATE() 
              GROUP BY group_ids
              ORDER BY transaction_date desc`

  // console.log(queryString);
  //var x=0;
  //var y=0;

  res.locals.aria_connection.query(queryString, async function (err, rows, fields) {
    if (err) throw err;

    var arr = [];
    // depresult = 0;
    paidresult = 0;
    for (var i in rows) {
      //    console.log('joined ID: ', rows[i].id);
      var paidresult = await get_paid(rows[i].id);
      var mydata = _.assign({}, rows[i], { paidtotal: paidresult[0].total, oitotal: paidresult[0]._oi_amount });
      //console.log(mydata);
      arr.push(mydata);
    }
    res.send(JSON.stringify(arr));
    res.locals.aria_connection.end();
  });

  //res.send(JSON.stringify(mydata));
  //  res.locals.aria_connection.end();
});

router.get('/getfilterdeposit', function (req, res, next) {
  function get_paid(rows) {
    var total_query = `SELECT sum(_net_amount) as total,sum(_oi_amount) as _oi_amount FROM cash_deposit2.0_central_sales_audit_header WHERE transaction_type='222' 
                AND branch_code='`+ req.session.branch + `' AND aria_trans_nos IN(` + rows + `)`;
    //  console.log('query: ', total_query);
    return new Promise(function (resolve, reject) {
      res.locals.aria_connection.query(total_query, (total_err, total_rows) => {
        if (total_err) {
          reject(total_err);
        }
        else {
          for (var i in total_rows) {
            //  console.log('Result: ', total_rows[i].total);
            resolve(total_rows);
          }
          // console.log(total_rows);
        }

      });
    });
  }
  //=============================================================
  if (req.query.status_type == 1) {
    var qry = `and cleared= 0`;
  }
  else if (req.query.status_type == 2) {
    var qry = `and cleared= 1`;
  }
  else {
    var qry = `and cleared IN (0,1)`;
  }

  /*var queryString = `SELECT * FROM cash_deposit2.0_sales_withdrawal
                    WHERE transaction_date>= '`+ req.query.date_from + `'
                    and transaction_date<= '`+ req.query.date_to + `'
                    AND branch_code='`+ req.session.branch + `'
                    `+ qry + ` ORDER BY transaction_date desc`;*/


  var queryString = `SELECT 
                    group_concat(memo_) as memo_ ,
                    group_concat(id) as id ,
                    SUM(_net_amount) as _net_amount,
                    max(cleared) as cleared,
                    group_concat(date_created) as date_created,
                    group_concat(transaction_date) as transaction_date,
                    CASE WHEN group_id	is null THEN id ELSE group_id END as group_ids
                    FROM cash_deposit2.0_sales_withdrawal
                    WHERE transaction_date>= '`+ req.query.date_from + `'
                    and transaction_date<= '`+ req.query.date_to + `'
                    AND branch_code='`+ req.session.branch + `' ` + qry + `
                    and cleared IN (0,1) GROUP BY group_ids
                    ORDER BY transaction_date desc`



  // console.log(queryString);
  //var x=0;
  //var y=0;

  res.locals.aria_connection.query(queryString, async function (err, rows, fields) {
    if (err) throw err;

    var arr = [];
    //  depresult = 0;
    paidresult = 0;
    for (var i in rows) {
      //console.log('joined ID: ', rows[i].ts_id);
      var paidresult = await get_paid(rows[i].id);
      var mydata = _.assign({}, rows[i], { paidtotal: paidresult[0].total, oitotal: paidresult[0]._oi_amount });
      //console.log(mydata);
      arr.push(mydata);
    }
    res.send(JSON.stringify(arr));
    res.locals.aria_connection.end();
  });

  //res.send(JSON.stringify(mydata));
  //  res.locals.aria_connection.end();
});
/*
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
    `+qry+`
    ORDER BY transaction_date desc
    `, 
   function (error, results, fields) {if(error) throw error;
    res.send(JSON.stringify(results));
  });
  res.locals.mysql_connection_91.end();
}
);
*/

/*
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
   `+qry+`
   ORDER BY transaction_date desc
   `, 
  function (error, results, fields) {if(error) throw error;
   res.send(JSON.stringify(results));
 });
 res.locals.mysql_connection_91.end();
}
);
*/

router.get('/getselecteddeposit', function (req, res, next) {
  //console.log(req.query);
  // console.log(`SELECT * FROM 0_sales_withdrawal where id IN (`+req.query.id+`)`);
  res.locals.mysql_connection_91.query(
    `SELECT * FROM 0_sales_withdrawal where id IN (` + req.query.id + `)`,
    function (error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    });
}
);

router.get('/getpaymenhistory', function (req, res, next) {

  var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  var string = req.query.group_ids;
  var queryadd = ``;
  if (string.match(format)) {
    console.log(`true`);
    var group_ids = req.query.group_ids;
    var queryadd = `and group_id IN (` + req.query.group_ids + `)`;
  } else {
    console.log(`false`);
    var group_ids = '';
  }
  var trans_type_query = "and transaction_type ='222' ";
  var queryStringhistory = `SELECT 
  aria_trans_nos as id,
  transaction_date,
  (select bank_account_name from  0_all_bank_accounts where account_code = aria_trans_gl_code) as aria_trans_gl_code,
  proof_type_number,
  _net_amount,
  _oi_amount,
  memo_,
    (select description from  cash_deposit2.0_tendertypes where tendercode = tender_code) as tender_code
  FROM cash_deposit2.0_central_sales_audit_header
  WHERE  branch_code='`+ req.session.branch + `' and aria_trans_nos IN (` + req.query.id + `)` + queryadd + trans_type_query;

  res.locals.mysql_connection_91.query(queryStringhistory,
    function (error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
      //console.log(results);
      // console.log(`SELECT * FROM 0_sales_withdrawal where id IN (`+req.query.id+`)`);
    });
}
);



router.post('/adddeposit', function (req, res, next) {

  var paid_stats = math.round(req.body.t_receivable, 2) - (math.round(req.body.amount, 2) + (math.round(req.body.t_paid, 2) - math.round(req.body.t_otherincome, 2)));
  var stats = paid_stats.toFixed(2);

  /*
    console.log(`stats...`, math.round(req.body.t_receivable, 2));
    console.log(`stats...`, (math.round(req.body.amount, 2)));
    console.log(`stats...`, math.round(req.body.t_paid, 2));
    console.log(`stats...`, math.round(req.body.t_otherincome, 2));
  
  
    console.log(`stats...`, stats);
  */

  var vat = math.abs(math.round((req.body.t_otherincome / 1.12) - req.body.t_otherincome, 2));

  //console.log(math.round(req.body.t_receivable, 2));
  //console.log(math.round(req.body.amount, 2));
  //console.log(math.round(req.body.t_paid, 2));
  //console.log(math.round(math.abs(paid_stats), 2));
  //console.log(stats);

  res.locals.mysql_connection_91.query(`INSERT INTO 0_sales_withdrawal_group (group_or,group_type) VALUES ('` + req.body.selected_ids + `','222')`,
    function (error, resultsg, fields) {
      if (error) throw error;

      res.locals.mysql_connection_91.query(`INSERT INTO cash_deposit2.0_central_sales_audit_header(_net_amount,memo_,transaction_date,date_created,deposit_date,transaction_type,aria_trans_gl_code,process_type, aria_trans_nos, branch_code, created_by, _oi_amount, _vat_amount,group_id) 
        VALUES(` + req.body.amount + `,'` + req.body.memo + `','` + req.body.date_created + `','` + req.body.date_created + `','` + req.body.date_created + `',
        '222',` + req.body.aria_trans_gl_code + `,'1','` + req.body.selected_ids + `','` + req.session.branch + `','` + req.session.userId + `', ` + req.body.t_otherincome + `,  ` + vat + `,` + resultsg.insertId + `)`, function (error, results, fields) {
        if (error) throw error;
        //console.log(results.insertId);

        if (stats == 0) {
          res.locals.mysql_connection_91.query(`UPDATE 0_sales_withdrawal SET group_id =` + resultsg.insertId + `,cleared= 1, central_sales_audit_id=` + results.insertId + ` WHERE id IN (` + req.body.selected_ids + `)`,
            function (error, results2, fields) {
              if (error) throw error;
              res.send(JSON.stringify(results2));
            });
        } else {
          res.locals.mysql_connection_91.query(`UPDATE 0_sales_withdrawal SET group_id =` + resultsg.insertId + `,central_sales_audit_id=` + results.insertId + `  WHERE id IN (` + req.body.selected_ids + `)`,
            function (error, results2, fields) {
              if (error) throw error;
            });
          res.send(JSON.stringify(results));
        }


      });

    });



  /*
    res.locals.mysql_connection_91.query(`INSERT INTO cash_deposit2.0_central_sales_audit_header(_net_amount,memo_,transaction_date,date_created,deposit_date,transaction_type,aria_trans_gl_code,process_type, aria_trans_nos, branch_code, created_by, _oi_amount, _vat_amount) 
    VALUES(` + req.body.amount + `,'` + req.body.memo + `','` + req.body.date_created + `','` + req.body.date_created + `','` + req.body.date_created + `',
    '222',` + req.body.aria_trans_gl_code + `,'1','` + req.body.selected_ids + `','` + req.session.branch + `','` + req.session.userId + `', ` + req.body.t_otherincome + `,  ` + vat + `)`, function (error, results, fields) {
      if (error) throw error;
      //console.log(results.insertId);
  
      if (stats <= 0) {
        res.locals.remittance_connection.query(`UPDATE cash_deposit2.0_sales_withdrawal SET cleared= 1, central_sales_audit_id=` + results.insertId + ` WHERE id IN (` + req.body.selected_ids + `)`,
          function (error, results2, fields) {
            if (error) throw error;
            //console.log(req.body.selected_ids);
            res.send(JSON.stringify(results2));
          });
      }
      else {
        res.send(JSON.stringify(results));
      }
  
    }); */



});

router.put('/updatedeposit', function (req, res, next) {
  res.locals.mysql_connection_91.query("UPDATE cash_deposit2.0_central_sales_audit_header SET _net_amount= '" + req.body.amount + "' where id = '" + req.body.id + "'", function (error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
  });
});

router.delete('/deletedeposit', function (req, res, next) {
  res.locals.mysql_connection_91.query("DELETE FROM cash_deposit2.0_central_sales_audit_header where aria_trans_nos = '" + req.body.id + "' and branch_code= '" + req.session.branch + "'", function (error, results, fields) {
    if (error) throw error;

    res.locals.mysql_connection_91.query("UPDATE cash_deposit2.0_sales_withdrawal SET cleared='0',central_sales_audit_id='0' where id = '" + req.body.id + "'",
      function (error, results2, fields) {
        if (error) throw error;
        //console.log(req.body.selected_ids);
        res.send(JSON.stringify(results2));
      });

    //res.send(JSON.stringify(results));
    //console.log(req.query.id);
  });
});

/* GET Tender Type listing. */
router.get('/tenderdropdown', function (req, res, next) {
  res.locals.mysql_connection_91.query("SELECT TenderCode, Description FROM cash_deposit2.0_tendertypes WHERE inactive=0", function (error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
  });
});

/* GET Bank Account listing. */
router.get('/bankdropdown', function (req, res, next) {
  res.locals.mysql_connection_91.query("SELECT account_code, bank_account_name FROM cash_deposit2.0_all_bank_accounts", function (error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
  });
});

/* GET Bank Account listing. */
router.get('/deposittypedropdown', function (req, res, next) {
  res.locals.mysql_connection_91.query("SELECT type, name FROM cash_deposit2.0_cash_transaction_type where action=1 and type not in (201,202,203) and inactive=0", function (error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
  });
});

router.get('/getsalescash', function (req, res, next) {
  res.locals.mysql_connection_91.query("select sum(total_cash) as cash from 0_remittance_summary where r_summary_date = '" + req.query.remittance_date + "'", function (error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
    //  console.log(req.query.remittance_date);
  });
});

router.get('/getsalesdeposited', function (req, res, next) {
  res.locals.mysql_connection_91.query("SELECT sum(_net_amount) as cash FROM cash_deposit2.0_central_sales_audit_header where process_type=1 and transaction_type=61 and transaction_date= '" + req.query.remittance_date + "'", function (error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
    //console.log(req.query.remittance_date);
  });
});

router.get('/getsaleswithdrawal', function (req, res, next) {
  res.locals.mysql_connection_91.query("SELECT sum(_net_amount) as cash FROM cash_deposit2.0_central_sales_audit_header where process_type=2 and transaction_type=61 and transaction_date= '" + req.query.remittance_date + "'", function (error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
    //console.log(req.query.remittance_date);
  });
});

router.get('/getpayment', function (req, res, next) {
  res.locals.mysql_connection_91.query(`SELECT SUM(_net_amount) as total_paid 
  FROM cash_deposit2.0_central_sales_audit_header
  where transaction_type='222' and aria_trans_nos IN (`+ req.query.id + `)`, function (error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
    //console.log(req.query.id);
  });

  res.locals.mysql_connection_91.end();
});

module.exports = router;