var express = require('express');
var router = express.Router();
const path = require("path");
const multer = require("multer");


var mysql = require("mysql");
var pool = mysql.createPool({
    connectionLimit: 100,
    host: '192.168.0.91',
    user: 'root',
    password: 'srsnova', 
    database: 'cash_deposit2'
});


router.get('/testpool', function(req, res, next) {
pool.getConnection(function(err, connection){    
  //run the query
  connection.query('select * from cash_deposit2.0_central_sales_audit_header',  function(err, rows){
    if(err) throw err;
    else {
        //console.log(rows);
        res.send(JSON.stringify(rows));
    }
  });
   
  connection.release();//release the connection
});
}
);

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
    `select csh.*, ct.name, ct.action 
    from cash_deposit2.0_central_sales_audit_header csh
    left join cash_deposit2.0_cash_transaction_type as ct 
    on csh.transaction_type=ct.type 
    where branch_code='`+req.session.branch+`'
    and process_type=0 
    and transaction_date>= '`+req.query.date_from+`'
    and transaction_date<= '`+req.query.date_to+`'
    `+qry+`
    and type in (201,202,203) ORDER BY transaction_date DESC`, 
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
  
     res.locals.mysql_connection_91.query(
      `select csh.*, ct.name, ct.action 
      from cash_deposit2.0_central_sales_audit_header csh
      left join cash_deposit2.0_cash_transaction_type as ct 
      on csh.transaction_type=ct.type 
      where branch_code='`+req.session.branch+`'
      and process_type=0 
      and transaction_date>= '`+req.query.date_from+`'
      and transaction_date<= '`+req.query.date_to+`'
      `+qry+`
      and type in (201,202,203) ORDER BY transaction_date DESC`, 
     function (error, results, fields) {if(error) throw error;
      res.send(JSON.stringify(results));
    });
    res.locals.mysql_connection_91.end();
  }
  );


  router.post('/adddeposit2', function(req, res, next) {
    res.locals.mysql_connection_91.query(`INSERT INTO cash_deposit2.0_central_sales_audit_header 
    (_net_amount,memo_,transaction_date,deposit_date,date_created,transaction_type,aria_trans_gl_code,process_type,branch_code, created_by) 
    VALUES('`+req.body.amount+ `', '`+req.body.memo+ `', '`+req.body.transaction_date+`',
    '`+req.body.deposit_date+`', '`+req.body.date_created+`', '`+req.body.transaction_detail_type+`',
    '`+req.body.aria_trans_gl_code+`','0','`+req.session.branch+ `','`+req.session.userId+ `')`, 
    function (error, results, fields) {
        if(error) throw error;

        const storage = multer.diskStorage({
          destination: "./public/uploads/",
          filename: function(req, file, cb){
            cb(null,"Deposit-" + Date.now());
          }
        });
        
        const upload = multer({
          storage: storage,
          limits:{fileSize: 100000000},
        }).single("myImage");
    
        upload(req, res2, (err) => {
          //console.log("Request 1---", req);
          //console.log("Request 1---", req.body);
          //console.log("Request 2 ---", req.body.formData);//Here you get file.
          //console.log("Request 3 ---", req.file);//Here you get file.
    
           if(!err)
              return res2.send(200).end();
        });

        res2.send(JSON.stringify(results));
    });
  });


router.post('/adddeposit3', function(req, res, next) {

  /*
//local destination upload
      const localstorage = multer.diskStorage({
        destination: "C:/uploads",
        filename: function(req, file, cb){
          //console.log("Request ---x", req.body);
          cb(null,req.session.branch + "-DEPOSIT-" + Date.now() + path.extname(file.originalname));
        }
      });

      const localupload = multer({
        storage: localstorage,
        limits:{fileSize: 100000000},
      }).single("myImage");

      localupload(req, res, (err) => {
        if(!err)
        return res.sendStatus(200).end();
      });

*/


  const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function(req, file, cb){
      //console.log("Request ---x", req.body);
      cb(null,req.session.branch + "-DEPOSIT-" + Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({
    storage: storage,
    limits:{fileSize: 100000000},
  }).single("myImage");

  //console.log("Request ---", req.body);

  
  upload(req, res, (err) => {
  //console.log("Request ---1", req.body);
  //console.log("Request ---2", req.body.amount);
  //console.log("Request ---3", req.body.memo);
  //console.log("Request file ---", req.file);//Here you get file.
  /*Now do where ever you want to do*/

  if(req.file=='' || req.file==undefined){
    var file='';
    //console.log('pasok1');
  }
  else{
    var file=req.file.filename;
    //console.log('pasok2');
  }

  res.locals.mysql_connection_91.query(`INSERT INTO cash_deposit2.0_central_sales_audit_header 
  (_net_amount,memo_,transaction_date,deposit_date,date_created,transaction_type,aria_trans_gl_code,process_type,branch_code,created_by,attachment_name) 
  VALUES('`+req.body.amount+ `', '`+req.body.memo+ `', '`+req.body.transaction_date+`',
  '`+req.body.date_deposited+`', '`+req.body.date_created+`', '`+req.body.transaction_detail_type+`',
  '`+req.body.aria_trans_gl_code+`','0','`+req.session.branch+ `','`+req.session.userId+ `','`+file+ `')`, 
  function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });


  });

});

//working
/*
router.post('/adddepositx', function(req, res, next) {
  //console.log(req);
  console.log(req.body);
  console.log(req.body.amount);
  console.log(req.body.myData);
  
  res.locals.mysql_connection_91.query(`INSERT INTO cash_deposit2.0_central_sales_audit_header 
  (_net_amount,memo_,transaction_date,deposit_date,date_created,transaction_type,aria_trans_gl_code,process_type,branch_code, created_by) 
  VALUES('`+req.body.amount+ `', '`+req.body.memo+ `', '`+req.body.transaction_date+`',
  '`+req.body.deposit_date+`', '`+req.body.date_created+`', '`+req.body.transaction_detail_type+`',
  '`+req.body.aria_trans_gl_code+`','0','`+req.session.branch+ `','`+req.session.userId+ `')`, 
  function (error, results, fields) {
      if(error) throw error;


      const storage = multer.diskStorage({
        destination: "./public/uploads/",
        filename: function(req, file, cb){
          cb(null,"Deposit-" + Date.now());
        }
      });
      
      const upload = multer({
        storage: storage,
        limits:{fileSize: 1000000},
      }).single("myImage");
      console.log("Request 2 ---", req.body.image_file);//Here you get file.
      console.log("Request 3 ---", req.file);//Here you get file.
      console.log("Request 4 ---", req.files);//Here you get file.

      upload(req, res, (err) => {
        //console.log("Request 1---", req);
        console.log("Request 1---", req.body);
        console.log("Request 2 ---", req.body.image_file);//Here you get file.
        console.log("Request 3 ---", req.file);//Here you get file.
        console.log("Request 4 ---", req.files);//Here you get file.
      });

      res.send(JSON.stringify(results));
  });


});
*/

router.post('/adddeposit', function(req, res, next) {
  //console.log(req);
  //console.log(req.body);
  //console.log(req.body.amount);
  //console.log(req.body.myData);
  
  res.locals.mysql_connection_91.query(`INSERT INTO cash_deposit2.0_central_sales_audit_header 
  (_net_amount,memo_,transaction_date,deposit_date,date_created,transaction_type,aria_trans_gl_code,process_type,branch_code, created_by) 
  VALUES('`+req.body.amount+ `', '`+req.body.memo+ `', '`+req.body.transaction_date+`',
  '`+req.body.date_deposited+`', '`+req.body.date_created+`', '`+req.body.transaction_detail_type+`',
  '`+req.body.aria_trans_gl_code+`','0','`+req.session.branch+ `','`+req.session.userId+ `')`, 
  function (error, results, fields) {
      if(error) throw error;

/*
      const storage = multer.diskStorage({
        destination: "./public/uploads/",
        filename: function(req, file, cb){
          cb(null,"Deposit-" + Date.now());
        }
      });
      
      const upload = multer({
        storage: storage,
        limits:{fileSize: 1000000},
      }).single("myImage");
      console.log("Request 2 ---", req.body.image_file);//Here you get file.
      console.log("Request 3 ---", req.file);//Here you get file.
      console.log("Request 4 ---", req.files);//Here you get file.

      upload(req, res, (err) => {
        //console.log("Request 1---", req);
        console.log("Request 1---", req.body);
        console.log("Request 2 ---", req.body.image_file);//Here you get file.
        console.log("Request 3 ---", req.file);//Here you get file.
        console.log("Request 4 ---", req.files);//Here you get file.
      });
      */

      res.send(JSON.stringify(results));
  });


});

router.post('/addimage', function(req, res, next) {
      const storage = multer.diskStorage({
        destination: "./public/uploads/",
        filename: function(req, file, cb){
          cb(null,"Deposit-" + Date.now());
        }
      });
      
      const upload = multer({
        storage: storage,
        limits:{fileSize: 1000000},
      }).single("myImage");
  
      upload(req, res, (err) => {
        //console.log("Request 1---", req);
        //console.log("Request 1---", req.body);
        //console.log("Request 2 ---", req.body.formData);//Here you get file.
        //console.log("Request 3 ---", req.file);//Here you get file.
  
         if(!err)
            return res.send(200).end();
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
  res.locals.mysql_connection_91.query("SELECT sum(_net_amount) as cash FROM cash_deposit2.0_central_sales_audit_header where transaction_type IN (201,202,203) and transaction_date= '"+req.query.remittance_date+"' and branch_code= '"+req.session.branch+"' ", function (error, results, fields) {
   if(error) throw error;
   res.send(JSON.stringify(results));
   //console.log(req.query.remittance_date);
 });
  res.locals.mysql_connection_91.end();
});

router.get('/getsaleswithdrawal', function(req, res, next) {
  res.locals.mysql_connection_91.query("SELECT sum(_net_amount) as cash FROM cash_deposit2.0_sales_withdrawal where transaction_date= '"+req.query.remittance_date+"' and branch_code= '"+req.session.branch+"' ", function (error, results, fields) {
   if(error) throw error;
   res.send(JSON.stringify(results));
  // console.log(req.query.remittance_date);
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