var express = require('express');
var router = express.Router();
//var passwordHash = require('password-hash');
var crypto = require('crypto');
//var cookieParser = require('cookie-parser');
//var session    = require('express-session');

const db_config = require('../db_config');

//console.log(db_config);
//console.log(db_config.br_code_connection);
//var branches = db_config.br_code_connection[branch_code];
//console.log(branches + 'ssssss');
router.get('/getbranches', function (req, res, next) {
  const ses = db_config.br_code_connection;
  res.send(JSON.stringify(ses)); //send multiple result
});


/* GET users listing. */
router.get('/getusersession', function (req, res, next) {
  const ses = {
    loggedin: req.session.loggedin,
    user: req.session.user,
    userId: req.session.userId,
    branch: req.session.branch,
    branch_name: req.session.branch_name
  };
  res.send(JSON.stringify(ses)); //send multiple result
});

/* GET users listing. */
router.get('/testsession', function (req, res) {
  if (req.session.page_views) {
    req.session.page_views++;
    res.send("You visited this page " + req.session.page_views + " times");
    //console.log(req.session.key);
  } else {
    req.session.page_views = 1;
    res.send("Welcome to this page for the first time!");
  }
});

router.get('/testsessiony', function (req, res, next) {
  res.send("You visited this page: " + req.sessionID);
});

router.get('/testsessionx', function (req, res, next) {
  res.send("You visited this page: " + req.session.page_views);
});

router.get('/getusers', function (req, res) {
  req.session.loginid = 'admin';
  res.send("You visited this page " + req.session.loginid + " times");
});

router.get('/getuser', function (req, res, next) {

  //console.log(req.session.branch);



  let password = crypto.createHash('md5').update(req.query.password).digest("hex")
  //console.log(password);
  //var hashedPassword = passwordHash.generate(req.query.password,  {algorithm: 'md5'});
  //console.log(hashedPassword);

  res.locals.users_connection.query(`SELECT emp_number, user_name FROM cash_deposit2.hs_hr_users 
  where user_name= '` + req.query.user_id + `' and user_password='` + password + `'`,
    function (error, results, fields) {
      if (error) throw error

      try {
        req.session.userId = results[0].emp_number;
        if (req.session.userId != 0 || req.session.userId != '') {
          const br_id = req.query.branch_login;
          req.session.loggedin = true;
          // req.session.emp_code = results[0].emp_code;
          req.session.user = results[0].user_name;
          req.session.branch_id = br_id;
          req.session.branch = db_config.br_code_connection[br_id].br_code;
          req.session.branch_name = db_config.br_code_connection[br_id].br_name;
          const ses = {
            user: req.session.user,
            userId: req.session.userId,
            branch: req.session.branch,
            branch_name: req.session.branch_name
          };
          res.send(JSON.stringify(ses)); //send multiple result
        }
      } catch (e) {
        res.status(400).send('Invalid JSON string')
      }

    });

});

/*
if (results.length>0) {
  req.session.loggedin = true;
  req.session.userId = results[0].id;
  req.session.emp_code = results[0].emp_code;
  req.session.user = results[0].user;
  req.session.branch = 'srsn';
  const ses= {user:  req.session.user, userId: req.session.userId, branch: req.session.branch};
  res.send(JSON.stringify(ses));//send multiple result
  }
  else {
    response.send('Incorrect Username and/or Password!');
  }
  */

router.get('/logout', function (req, res, next) {
  var status = req.session.loggedin = false;
  req.session.destroy();
  res.send(status);
  //res.redirect(302, 'http://192.168.0.188:8888/login');
});

module.exports = router;