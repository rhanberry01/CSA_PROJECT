var express = require('express');
var router = express.Router();
var math = require('mathjs');
var _ = require('lodash');

router.get('/getdeposit', function (req, res, next) {

  function get_paid(rows) {

    var total_query = `SELECT sum(_net_amount) as total,sum(_oi_amount) as _oi_amount,sum(_ewt) as _ewt,sum(due_to_customer) as due_to_customer,sum(due_to_employee) as due_to_employee FROM cash_deposit2.0_central_sales_audit_header WHERE transaction_type='219' 
           AND branch_code='` + req.session.branch + `' AND aria_trans_nos IN(` + rows + `)`;
    return new Promise(function (resolve, reject) {
      res.locals.aria_connection.query(total_query, (total_err, total_rows) => {
        if (total_err) {
          reject(total_err);
        } else {
          for (var i in total_rows) {
            //console.log('Result: ', total_rows[i].total);
            resolve(total_rows);
          }
          //console.log(total_rows); 
        }

      });
    });

  }
  //=============================================================
  if (req.query.status_type == 1) {
    var qry = `and paid= 0`;
  } else if (req.query.status_type == 2) {
    var qry = `and paid= 1`;
  } else {
    var qry = `and paid IN (0,1)`;
  }

  /*var queryString = `SELECT * FROM 0_other_trans as ot 
              LEFT JOIN 0_tendertypes_category as ttc 
              ON ot.tender_type_category=ttc.tender_category_id 
              where tender_type in ('103','104') 
              and transaction_date>= '` + req.query.date_from + `'
              and transaction_date<= '` + req.query.date_to + `'
              ` + qry + ` ORDER BY transaction_date desc`;*/


  var queryString = `SELECT
              group_concat(central_sales_audit_id) as central_sales_audit_id,
              count(trans_no) as group_,
              group_concat(trans_no) as trans_no, 
              group_concat(transaction_date) as transaction_date,
              group_concat(account_name) as account_name,
              group_concat(category_desc) as category_desc,
              sum(trans_amount) as trans_amount,
              max(paid) as paid,
              group_concat(card_desc) as card_desc,
              group_concat(gl_account) as gl_account,
              CASE WHEN group_id	is null THEN id ELSE group_id END as group_ids
              FROM 0_other_trans as ot
              LEFT JOIN 0_tendertypes_category as ttc
              ON ot.tender_type_category=ttc.tender_category_id
              where tender_type in ('103','104')
              and cast(lastdatemodified as date) = CURRENT_DATE()
              ` + qry + `  GROUP BY group_ids 
              ORDER BY transaction_date desc`;

  //var x=0;
  //var y=0;
  //console.log(queryString);
  res.locals.remittance_connection.query(queryString, async function (err, rows, fields) {
    if (err) throw err;

    var arr = [];
    depresult = 0;
    paidresult = 0;
    //    console.log(rows, 'showing unpaid and paid');
    for (var i in rows) {
      var paidresult = await get_paid(rows[i].trans_no, rows[i].trans_no);
      var mydata = _.assign({}, rows[i], {
        paidtotal: paidresult[0].total,
        _oi_amount: paidresult[0]._oi_amount,
        _ewt: paidresult[0]._ewt,
        due_to_customer: paidresult[0].due_to_customer,
        due_to_employee: paidresult[0].due_to_employee
      });
      //console.log(mydata);
      arr.push(mydata);
    }
    res.send(JSON.stringify(arr));
    res.locals.aria_connection.end();
    res.locals.remittance_connection.end();
  });

  //res.send(JSON.stringify(mydata));
  //  res.locals.aria_connection.end();
});

router.get('/getfilterdeposit', function (req, res, next) {
  function get_paid(rows) {
    var total_query = `SELECT sum(_net_amount) as total,sum(_oi_amount) as _oi_amount,sum(_ewt) as _ewt,sum(due_to_customer) as due_to_customer,sum(due_to_employee) as due_to_employee  FROM cash_deposit2.0_central_sales_audit_header WHERE transaction_type='219' 
      AND branch_code='` + req.session.branch + `' AND aria_trans_nos IN(` + rows + `)`;

    return new Promise(function (resolve, reject) {
      res.locals.aria_connection.query(total_query, (total_err, total_rows) => {
        if (total_err) {
          reject(total_err);
        } else {
          for (var i in total_rows) {
            //console.log('Result: ', total_rows[i].total);
            resolve(total_rows);
          }
          //console.log(total_rows); 
        }

      });
    });
  }
  //=============================================================
  if (req.query.status_type == 1) {
    var qry = `and paid= 0`;
  } else if (req.query.status_type == 2) {
    var qry = `and paid= 1`;
  } else {
    var qry = `and paid IN (0,1)`;
  }

  /* var queryString = `SELECT trans_no,transaction_date,account_name,category_desc,trans_amount,paid,group_id,card_desc,gl_account  FROM 0_other_trans as ot 
           LEFT JOIN 0_tendertypes_category as ttc 
           ON ot.tender_type_category=ttc.tender_category_id 
           where tender_type in ('103','104') 
           and transaction_date>= '` + req.query.date_from + `'
           and transaction_date<= '` + req.query.date_to + `'
           ` + qry + ` ORDER BY transaction_date desc`;*/



  var queryString = `SELECT
          group_concat(central_sales_audit_id) as central_sales_audit_id,
          count(trans_no)  as group_,
          group_concat(trans_no) as trans_no, 
          group_concat(transaction_date) as transaction_date,
          group_concat(account_name) as account_name,
          group_concat(category_desc) as category_desc,
          sum(trans_amount) as trans_amount,
          max(paid) as paid,
          group_concat(card_desc) as card_desc,
          group_concat(gl_account) as gl_account,
          CASE WHEN group_id	is null THEN id ELSE group_id END as group_ids
          FROM 0_other_trans as ot
          LEFT JOIN 0_tendertypes_category as ttc
          ON ot.tender_type_category=ttc.tender_category_id
          where tender_type in ('103','104')
          and transaction_date>= '` + req.query.date_from + `'
          and transaction_date<= '` + req.query.date_to + `'
          ` + qry + `  GROUP BY group_ids  ORDER BY transaction_date desc`;



  //var x=0;
  //var y=0;

  res.locals.remittance_connection.query(queryString, async function (err, rows, fields) {
    if (err) throw err;

    var arr = [];
    depresult = 0;
    paidresult = 0;
    for (var i in rows) {
      //console.log('joined ID: ', rows[i].ts_id);
      var paidresult = await get_paid(rows[i].trans_no);
      var mydata = _.assign({}, rows[i], {
        paidtotal: paidresult[0].total,
        _oi_amount: paidresult[0]._oi_amount,
        _ewt: paidresult[0]._ewt,
        due_to_customer: paidresult[0].due_to_customer,
        due_to_employee: paidresult[0].due_to_employee

      });
      //console.log(mydata);
      arr.push(mydata);
    }
    res.send(JSON.stringify(arr));
    res.locals.aria_connection.end();
    res.locals.remittance_connection.end();
  });

  //res.send(JSON.stringify(mydata));
  //  res.locals.aria_connection.end();
});
/*
router.get('/getdeposit', function(req, res, next) {

    if(req.query.status_type==1){
      var qry=`and paid= 0`;
    }
    else if(req.query.status_type==2){
      var qry=`and paid= 1`;
    }
    else {
      var qry=`and paid IN (0,1)`;
    }

    res.locals.remittance_connection.query(
      `SELECT * FROM cashier_remittance.0_other_trans as ot 
      LEFT JOIN 0_tendertypes_category as ttc 
      ON ot.tender_type_category=ttc.tender_category_id 
      where tender_type in ('103','104') 
      and transaction_date>= '`+req.query.date_from+`'
      and transaction_date<= '`+req.query.date_to+`'
      `+qry+` ORDER BY transaction_date desc`, 
    function (error, results, fields) {if(error) throw error;
      res.send(JSON.stringify(results));
    }),
    res.locals.remittance_connection.end();
});
*/
/*
router.get('/getfilterdeposit', function(req, res, next) {
  
      if(req.query.status_type==1){
        var qry=`and paid= 0`;
      }
      else if(req.query.status_type==2){
        var qry=`and paid= 1`;
      }
      else {
        var qry=`and paid IN (0,1)`;
      }
    
      res.locals.remittance_connection.query(
        `SELECT * FROM cashier_remittance.0_other_trans as ot 
        LEFT JOIN 0_tendertypes_category as ttc 
        ON ot.tender_type_category=ttc.tender_category_id 
        where tender_type in ('103','104') 
        and transaction_date>= '`+req.query.date_from+`'
        and transaction_date<= '`+req.query.date_to+`'
        `+qry+` ORDER BY transaction_date desc`, 
      function (error, results, fields) {if(error) throw error;
        res.send(JSON.stringify(results));
      }),
      res.locals.remittance_connection.end();
     });
  */

router.get('/getselecteddeposit', function (req, res, next) {
  res.locals.remittance_connection.query(
    `SELECT * FROM 0_other_trans as ot 
        LEFT JOIN 0_tendertypes_category as ttc 
        ON ot.tender_type_category=ttc.tender_category_id 
        where tender_type in ('103','104') 
        AND transaction_date>='2019-01-01' 
        AND trans_no IN (` + req.query.id + `)`,
    function (error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
      // console.log(req.query);
      //console.log(results);
      // console.log(`SELECT * FROM 0_sales_withdrawal where id IN (`+req.query.id+`)`);
    });
});


router.get('/getpaymenhistory', function (req, res, next) {
  // console.log(`SELECT * FROM cash_deposit2.0_central_sales_audit_header WHERE branch_code='` + req.session.branch + `'  and aria_trans_nos IN (` + req.query.id + `)`);

  res.locals.mysql_connection_91.query(
    `SELECT transaction_date,deposit_date,
    (select bank_account_name from  0_all_bank_accounts where account_code = aria_trans_gl_code) as aria_trans_gl_code,
      proof_type_number,
      _net_amount,
      _ewt,
      _oi_amount,
      due_to_customer,
      due_to_employee,
      memo_,
      (select description from  cash_deposit2.0_tendertypes where tendercode = tender_code) as tender_code
    FROM cash_deposit2.0_central_sales_audit_header
    WHERE branch_code='`+ req.session.branch + `'  and aria_trans_nos IN (` + req.query.id + `)`,
    function (error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
      console.log(req.query + 'test');
      //console.log(results);
      // console.log(`SELECT * FROM 0_sales_withdrawal where id IN (`+req.query.id+`)`);
    });
});


router.post('/adddeposit', function (req, res, next) {

  var ewt = 0;
  var other_income = 0;
  var overpayment = 0;
  var due_to_customer = req.body.due_to_customer;
  //console.log(req.body.overtype + 'overtype');
  switch (req.body.overtype) {
    case 'wtv': // ewt 
      ewt = req.body.t_otherincome;
      break;
    case 'wtnv': // ewt 
      ewt = req.body.t_otherincome;
      break;
    case 'ot': // otherincome
      other_income = req.body.t_otherincome;
      break;
    case 'ov': // overpayement
      //console.log(req.body.t_otherincome + 'CASES');
      overpayment = req.body.t_otherincome;
      break;

  }
  var amount = req.body.amount;
  var due_to_employee = req.body.dueee;

  //console.log(due_to_employee + 'due_to_employee');

  if (due_to_customer != 0) {
    overpayment = ((req.body.amount) - ewt - due_to_customer) - due_to_customer;
    amount = (req.body.amount - ewt - due_to_customer);
    // console.log(amount + 'due')
  }




  var paid_stats = math.round(req.body.t_receivable, 2) - ((math.round(amount, 2) + math.round(due_to_employee, 2)) + math.round(req.body.t_paid, 2) - math.round(other_income, 2));
  var stats = math.round(paid_stats);

  /*console.log(ewt);
  console.log(overpayment + 'overpayment');
  console.log(other_income);
  console.log(math.round(req.body.t_receivable, 2));
  console.log(math.round(amount, 2));
  console.log(math.round(req.body.t_paid, 2));
  console.log(math.round(math.abs(paid_stats), 2));
  console.log(stats + 'stats');*/


  // console.log(`INSERT INTO 0_group_other_trans (group_or,group_type) VALUES ('` + req.body.selected_ids + `','219')`);
  res.locals.remittance_connection.query(`INSERT INTO 0_group_other_trans (group_or,group_type) VALUES ('` + req.body.selected_ids + `','219')`,
    function (error, resultsg, fields) {
      if (error) throw error;
      //console.log(req.body.selected_ids);
      // res.send(JSON.stringify(resultsg));

      res.locals.mysql_connection_91.query(`INSERT INTO cash_deposit2.0_central_sales_audit_header(_net_amount,memo_,transaction_date,date_created,deposit_date,transaction_type,aria_trans_gl_code,process_type, aria_trans_nos, proof_type_number, branch_code, tender_code, created_by,group_id,_oi_amount,_ewt,due_to_customer,due_to_employee) 
              VALUES(` + (req.body.amount - ewt - due_to_customer) + `,'` + req.body.memo + `','` + req.body.sales_date + `','` + req.body.date_created + `','` + req.body.deposit_date + `',
              '219',` + req.body.aria_trans_gl_code + `,'1','` + req.body.selected_ids + `','` + req.body.ref + `','` + req.session.branch + `','` + req.body.tendercode + `','` + req.session.userId + `','` + resultsg.insertId + `','` + other_income + `','` + ewt + `','` + overpayment + `','` + due_to_employee + `')`,
        function (error, results, fields) {
          if (error) throw error;
          //console.log(results.insertId);

          if (stats == 0) {

            //   console.log(`UPDATE 0_other_trans SET paid= 1,group_id=` + resultsg.insertId + `,central_sales_audit_id=` + results.insertId + ` WHERE trans_no IN (` + req.body.selected_ids + `) AND tender_type IN(` + req.body.trans_type + `)`);
            res.locals.remittance_connection.query(`UPDATE 0_other_trans SET paid= 1,group_id=` + resultsg.insertId + `,central_sales_audit_id=` + results.insertId + ` WHERE trans_no IN (` + req.body.selected_ids + `) AND tender_type IN(` + req.body.trans_type + `)`,
              function (error, results2, fields) {
                if (error) throw error;
                //console.log(req.body.selected_ids);
                res.send(JSON.stringify(results2));
              });
          } else {
            //  console.log(`UPDATE 0_other_trans SET group_id =` + resultsg.insertId + ` central_sales_audit_id=` + results.insertId + `  WHERE trans_no IN (` + req.body.selected_ids + `) AND tender_type IN(` + req.body.trans_type + `)`);

            res.locals.remittance_connection.query(`UPDATE 0_other_trans SET group_id =` + resultsg.insertId + `,central_sales_audit_id=` + results.insertId + `  WHERE trans_no IN (` + req.body.selected_ids + `) AND tender_type IN(` + req.body.trans_type + `)`,
              function (error, results2, fields) {
                if (error) throw error;
                //console.log(req.body.selected_ids);
                // res.send(JSON.stringify(results2));
              });
            res.send(JSON.stringify(results));
          }

        });

    });

});

/*
router.put('/updatedeposit', function(req, res, next) {
  res.locals.mysql_connection_91.query("UPDATE cash_deposit2.0_central_sales_audit_header SET _net_amount= '"+req.body.amount+"', memo_= '"+req.body.memo+"' where id = '"+req.body.id+"'", function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  }); 
});
*/

router.delete('/deletedeposit', function (req, res, next) {

  selectdelid = "select group_concat(id) as id from cash_deposit2.0_central_sales_audit_header where aria_trans_nos in(" + req.body.trans_no + ") and  branch_code= '" + req.session.branch + "' ";
  console.log(selectdelid);
  res.locals.mysql_connection_91.query(selectdelid, function (error, results, fields) {
    if (error) throw error;
    delquer = "DELETE FROM cash_deposit2.0_central_sales_audit_header where id IN(" + results[0].id + ") and  branch_code= '" + req.session.branch + "' ";
    res.locals.mysql_connection_91.query(delquer, function (error, results, fields) {
      if (error) throw error;
      updatequer = "UPDATE 0_other_trans SET central_sales_audit_id =null,group_id=null,paid =0 where central_sales_audit_id IN(" + req.body.id + ")";
      console.log(updatequer);
      res.locals.remittance_connection.query(updatequer, function (error, results, fields) {
        if (error) throw error;
        res.send(JSON.stringify(results));
      });

    });

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

router.get('/getpayment', function (req, res, next) {
  quer = `SELECT SUM(_net_amount) as total_paid,SUM(due_to_customer) as due_to_customer
  FROM cash_deposit2.0_central_sales_audit_header
  where aria_trans_nos IN (` + req.query.id + `) AND branch_code='` + req.session.branch + `' `;
  res.locals.mysql_connection_91.query(quer, function (error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
    console.log(quer);
  });

  res.locals.mysql_connection_91.end();
});

module.exports = router;