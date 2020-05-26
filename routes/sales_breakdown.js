var express = require('express');
var router = express.Router();
var moment = require('moment');
var ip = require('ip');
var ipaddr = require('ipaddr.js');
// Load the full build.
var _ = require('lodash');

router.get('/getipx', function(req, res, next){
  console.log('hi');
});

router.get('/getip', function(req, res, next){
  console.log(ip.address());
  console.log(req.ip);
  console.log(req.connection.remoteAddress);

  var addr = ipaddr.parse(req.ip);
  console.log(addr); // => [192, 168, 1, 1]
  console.log(addr.octets);
 

  res.send(JSON.stringify(req.ip));
});

router.get('/getbreakdown', function(req, res, next) {

      function get_dep(rows) {
        var date = moment(rows).format('YYYY-MM-DD');
        var total_query = `SELECT sum(_net_amount) as total FROM cash_deposit2.0_central_sales_audit_header WHERE transaction_date = '`+date+`' AND branch_code='`+req.session.branch+`' and transaction_type in (201,202,203) ORDER BY transaction_date DESC`;
            return new Promise(function (resolve , reject) {
                 res.locals.mysql_connection_91.query(total_query, (total_err, total_rows) => {
                    if (total_err){
                      reject(total_err);
                    }
                    else{
                      for (var i in total_rows) {
                         //console.log('Result: ', total_rows[i].total);
                         resolve(total_rows);
                     }
                      //console.log(total_rows); 
                    }
        
                });
            });
          }

      function get_with(rows) {
        var date = moment(rows).format('YYYY-MM-DD');
        var total_query = `SELECT sum(_net_amount) as total FROM cash_deposit2.0_sales_withdrawal WHERE transaction_date = '`+date+`' AND branch_code='`+req.session.branch+`' ORDER BY transaction_date DESC`;
            return new Promise(function (resolve , reject) {
                  res.locals.aria_connection.query(total_query, (total_err, total_rows) => {
                    if (total_err){
                      reject(total_err);
                    }
                    else{
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
            var queryString =`SELECT * FROM 0_salestotals
            where ts_date_remit>= '`+req.query.date_from+`'
            and ts_date_remit<= '`+req.query.date_to+`'`;
            //var x=0;
            //var y=0;
  
            res.locals.aria_connection.query(queryString, async function(err, rows, fields) {
            if (err) throw err;
  
            var arr=[];
            depresult=0;
            withresult=0;
            for (var i in rows) {
                //console.log('joined ID: ', rows[i].ts_id);
                var depresult= await get_dep(rows[i].ts_date_remit);
                var withresult= await get_with(rows[i].ts_date_remit);
                var mydata = _.assign({}, rows[i], {deptotal:depresult[0].total, withtotal:withresult[0].total});
                //console.log(mydata);
                arr.push(mydata);
            }
            res.send(JSON.stringify(arr));
            res.locals.aria_connection.end();
          });  
  
          //res.send(JSON.stringify(mydata));
        //  res.locals.aria_connection.end();
      
    });
  
    router.get('/getselectedbreakdown', function(req, res, next) {
      
            function get_dep(rows) {
              var date = moment(rows).format('YYYY-MM-DD');
              var total_query = `SELECT sum(_net_amount) as total FROM cash_deposit2.0_central_sales_audit_header WHERE transaction_date = '`+date+`' AND branch_code='`+req.session.branch+`' and transaction_type in (201,202,203)`;
                  return new Promise(function (resolve , reject) {
                       res.locals.mysql_connection_91.query(total_query, (total_err, total_rows) => {
                          if (total_err){
                            reject(total_err);
                          }
                          else{
                            for (var i in total_rows) {
                               //console.log('Result: ', total_rows[i].total);
                               resolve(total_rows);
                           }
                            //console.log(total_rows); 
                          }
              
                      });
                  });
                }
      
            function get_with(rows) {
              var date = moment(rows).format('YYYY-MM-DD');
              var total_query = `SELECT sum(_net_amount) as total FROM cash_deposit2.0_sales_withdrawal WHERE transaction_date = '`+date+`' AND branch_code='`+req.session.branch+`'`;
                  return new Promise(function (resolve , reject) {
                        res.locals.aria_connection.query(total_query, (total_err, total_rows) => {
                          if (total_err){
                            reject(total_err);
                          }
                          else{
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
                  var queryString =`SELECT * FROM 0_salestotals
                  where ts_date_remit>= '`+req.query.date_from+`'
                  and ts_date_remit<= '`+req.query.date_to+`'`;
                  //var x=0;
                  //var y=0;
        
                  res.locals.aria_connection.query(queryString, async function(err, rows, fields) {
                  if (err) throw err;
        
                  var arr=[];
                  depresult=0;
                  withresult=0;
                  for (var i in rows) {
                      //console.log('joined ID: ', rows[i].ts_id);
                      var depresult= await get_dep(rows[i].ts_date_remit);
                      var withresult= await get_with(rows[i].ts_date_remit);
                      var mydata = _.assign({}, rows[i], {deptotal:depresult[0].total, withtotal:withresult[0].total});
                      //console.log(mydata);
                      arr.push(mydata);
                  }
                  res.send(JSON.stringify(arr));
                  res.locals.aria_connection.end();
                });  
        
                //res.send(JSON.stringify(mydata));
              //  res.locals.aria_connection.end();
            
          });


router.get('/testsessiony', function(req, res, next){
  req.session.destroy()
});

router.get('/getdeposit', function(req, res, next) {

   res.locals.aria_connection.query(
    `SELECT * FROM 0_salestotals
    where ts_date_remit>= '`+req.query.date_from+`'
    and ts_date_remit<= '`+req.query.date_to+`'`, 
   function (error, results, fields) {if(error) throw error;
    res.send(JSON.stringify(results));
  });
  res.locals.aria_connection.end();
}

);

router.get('/getfilterdeposit', function(req, res, next) {
  
  res.locals.aria_connection.query(
    `SELECT * FROM 0_salestotals
    where ts_date_remit>= '`+req.query.date_from+`'
    and ts_date_remit<= '`+req.query.date_to+`'`, 
   function (error, results, fields) {if(error) throw error;
    res.send(JSON.stringify(results));
  });
  res.locals.aria_connection.end();
  }
  );



  router.get('/getzzz', function(req, res, next) {

    function cbAlertFinished(counter){
      //console.log(counter, "this is me.");
      return counter;
    }
    
    function queryx(rows, counter, cbAlertFinished) {
      var total_query = `SELECT ts_id as ts_id2, ts_sales as total FROM 0_salestotals WHERE ts_id = `+rows.ts_id+``;
      
          return new Promise(function (resolve , reject) {
               res.locals.aria_connection.query(total_query, (total_err, total_rows) => {
                  if (total_err){
                    reject(total_err);
                  }
                  else{
                    for (var i in total_rows) {
                       //console.log('Result: ', total_rows[i].total);
                       counter++;
                       resolve(total_rows);
                   }
                    //console.log(total_rows); 
                  }
      
              });
          });
        }
          //=============================================================
          var queryString =`SELECT * FROM 0_salestotals
          where ts_date_remit>= '2019-04-01'
          and ts_date_remit<= '2019-08-08'`;
          //var x=0;
          //var y=0;

          res.locals.aria_connection.query(queryString, async function(err, rows, fields) {
          if (err) throw err;

          var arr=[];
          
          for (var i in rows) {
              //console.log('joined ID: ', rows[i].ts_id);
              var results2= await queryx(rows[i], y, cbAlertFinished);
              var mydata = _.assign({}, rows[i], {total:results2[0].total, ts_id2:results2[0].ts_id2});
              //console.log(mydata);
              arr.push(mydata);
              //x++;
              //y++;
          }

          //console.log('total x: ', x);
          //console.log('total y: ', arr);
          res.send(JSON.stringify(arr));
          res.locals.aria_connection.end();
        });  

        //res.send(JSON.stringify(mydata));
      //  res.locals.aria_connection.end();
    
  });


router.get('/getdepositxyzz', function(req, res, next) {

  function query() {

    return new Promise(function (resolve , reject) {
         res.locals.aria_connection.query(sql, (total_err, total_rows) => {
            if (total_err){
              reject(total_err);
            }
            else{
              resolve(total_rows);
            }
                
        });
    });
  }


  function cbacker(counter){
    console.log(counter, "this is mex.");
    return counter;
  }

   function getSelected(rows, cbAlertFinished, cbacker) {

      var counter=0;
      var total_query = `SELECT ts_id as ts_id2, ts_sales as total FROM 0_salestotals WHERE ts_id = `+rows.ts_id+``;

     res.locals.aria_connection.query(total_query, async function(total_err, total_rows, total_fields) {
          if (total_err) throw total_err;
          for (var e in total_rows) {
             await console.log('Result: ', total_rows[e].total);
              counter++;
          }
          var xxx=cbAlertFinished(counter);
          var vvv=cbacker(counter);
          ///console.log(xxx);
          //console.log(vvv);

        
      });


    }

    function cbAlertFinished(counter){
     // console.log(counter, "this is me.");
      return counter;
    }
    //=============================================================
    var queryString =`SELECT * FROM 0_salestotals
      where ts_date_remit>= '2019-04-01'
      and ts_date_remit<= '2019-05-08'`;
      var x=0;
      var y=0;

      res.locals.aria_connection.query(queryString, function(err, rows, fields) {
      if (err) throw err;
      for (var i in rows) {
          //console.log('joined ID: ', rows[i].ts_id);
          var yyy=getSelected(rows[i], cbAlertFinished,cbacker);
          
          //console.log(yyy);
          x++;
      }

     // console.log('total x: ', x);
     //console.log('total y: ', y);
    });  

    });



  router.get('/getdepositxyz', function(req, res, next) {
      var queryString =`SELECT * FROM 0_salestotals
      where ts_date_remit>= '2019-04-01'
      and ts_date_remit<= '2019-05-08'`;
      var x=0;
       res.locals.aria_connection.query(queryString, function(err, rows, fields) {
        if (err) throw err;
        for (var i in rows) {
            //console.log('joined ID: ', rows[i].ts_id);
            var total_query = `SELECT ts_id as ts_id2, ts_sales as total FROM 0_salestotals WHERE ts_id = `+rows[i].ts_id+``;
            var y=0;
            var xxx= res.locals.aria_connection.query(total_query, function(total_err, total_rows, total_fields) {
                if (total_err) throw total_err;
                for (var e in total_rows) {
                    //console.log('Result: ', total_rows[e].total);
                    y++;
                }
            }); 
            x++;
        }
        //console.log('total x: ', x);
        //console.log('total y: ', y);
        //console.log('total y: ', xxx);
    });  
    });



  router.get('/getdepositxy', function(req, res, next) {
    var mydata=[];
    res.locals.aria_connection.query(
      `SELECT * FROM 0_salestotals
      where ts_date_remit>= '2019-04-01'
      and ts_date_remit<= '2019-05-08'
      `,
     function (error, results, fields) {
       if(error) throw error;
    //console.log(results.insertId);
    
    var x=10;

       _.forEach(results, function(value, key) {
          //console.log(key);
          //console.log(results[key]);
          var row = results[key];
          res.locals.aria_connection.query(`SELECT ts_id as ts_id2, ts_sales as total FROM 0_salestotals WHERE ts_id = `+row.ts_id+``, 
          function (error2, results2, fields2) {
          if(error2) throw error2;

          var mydata = _.assign({}, results[key], {total:results2[0].total, ts_id2:results2[0].ts_id2});
        // res.send(JSON.stringify(mydata));
          //mydatax = _.concat(mydata);
        // console.log(mydatax);

         // x++;
          //console.log(x);
          }); 
        });

    //res.send(JSON.stringify(mydatax));
    //console.log(x);
 
    //console.log(total);
  });
  });

  router.get('/getdeposity', function(req, res, next) {
    var mydata = [];
    res.locals.aria_connection.query(
      `SELECT * FROM 0_salestotals
      where ts_date_remit>= '2019-04-01'
      and ts_date_remit<= '2019-05-08'
      `,
     function (error, results, fields) {
       if(error) throw error;
    //console.log(results.insertId);
    
        Object.keys(results).forEach(function(key) {
            var row = results[key];
            //console.log(row.ts_id)
            res.locals.aria_connection.query(`SELECT ts_sales as total FROM 0_salestotals WHERE ts_id = `+row.ts_id+``, 
            function (error, results2, fields) {
            if(error) throw error;
            //results.extend(results2.total);
            //console.log(results2[0].total)
            results.push({ quantity: results2[0].total });
            }); 

      });   

      //console.log(results);
      res.send(JSON.stringify(results));
  });
  });
  

  router.get('/getdepositx', function(req, res, next) {
      var students = [];
     
       res.locals.aria_connection.query(
        `SELECT * FROM 0_salestotals
        where ts_date_remit>= '2019-04-01'
        and ts_date_remit<= '2019-05-08'
        `,
       function (error, results, fields) {
         if(error) throw error;


         Object.keys(results).forEach(function(key) {
          var row = results[key];
          //console.log(row.ts_id)


          res.locals.aria_connection.query(`SELECT ts_sales FROM 0_salestotals WHERE ts_id = `+row.ts_id+``, 
          function (error, results, fields) {
          if(error) throw error;
         // console.log(results)
          }); 


          });

        res.send(JSON.stringify(students));
        //console.log(students);
      });
      res.locals.aria_connection.end();
    }
    );

router.post('/adddeposit', function(req, res, next) {
  res.locals.mysql_connection_91.query(`INSERT INTO cash_deposit2.0_central_sales_audit_header 
  (_net_amount,memo_,transaction_date,deposit_date,date_created,transaction_type,aria_trans_gl_code,process_type,branch_code) 
  VALUES('`+req.body.amount+ `', '`+req.body.memo+ `', '`+req.body.transaction_date+`',
  '`+req.body.deposit_date+`', '`+req.body.date_created+`', '`+req.body.transaction_detail_type+`',
  '`+req.body.aria_trans_gl_code+`','0','`+req.session.branch+ `')`, 
  function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

router.put('/updatedeposit', function(req, res, next) {
  res.locals.mysql_connection_91.query(`UPDATE cash_deposit2.0_central_sales_audit_header 
  SET _net_amount= '`+req.body.amount+`', 
  transaction_type= '`+req.body.transaction_detail_type+`', 
  aria_trans_gl_code= '`+req.body.aria_trans_gl_code+`', 
  deposit_date='`+req.body.deposit_date+`', 
  memo_= '`+req.body.memo+`'
  where id = '`+req.body.id+`' `,
  function (error, results, fields) {
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
 res.locals.mysql_connection_91.end();
});

/* GET Bank Account listing. */
router.get('/deposittypedropdown', function(req, res, next) {
  res.locals.mysql_connection_91.query("SELECT type, name FROM cash_deposit2.0_cash_transaction_type where action=0 and type in (201,202,203) and inactive=0", function (error, results, fields) {
   if(error) throw error;
   res.send(JSON.stringify(results));
 });
   res.locals.mysql_connection_91.end();
});

router.get('/getsalesdeposited', function(req, res, next) {
  res.locals.mysql_connection_91.query("SELECT sum(_net_amount) as cash FROM cash_deposit2.0_central_sales_audit_header where transaction_type IN (201,202,203) and transaction_date= '"+req.query.remittance_date+"'", function (error, results, fields) {
   if(error) throw error;
   res.send(JSON.stringify(results));
   //console.log(req.query.remittance_date);
 });
  res.locals.mysql_connection_91.end();
});

router.get('/getsaleswithdrawal', function(req, res, next) {
  res.locals.mysql_connection_91.query("SELECT sum(_net_amount) as cash FROM cash_deposit2.0_sales_withdrawal where transaction_date= '"+req.query.remittance_date+"'", function (error, results, fields) {
   if(error) throw error;
   res.send(JSON.stringify(results));
   //console.log(req.query.remittance_date);
 });
 res.locals.mysql_connection_91.end();
});

router.get('/getsalescash', function(req, res, next) {
  res.locals.remittance_connection.query("select sum(total_cash) as cash from 0_remittance_summary where r_summary_date = '"+req.query.remittance_date+"'", function (error, results, fields) {
   if(error) throw error;
   res.send(JSON.stringify(results));
   //console.log(req.query.remittance_date);
 });
 res.locals.remittance_connection.end();
});

module.exports = router;