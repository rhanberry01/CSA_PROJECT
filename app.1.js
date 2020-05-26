const config = require('./db_config');
console.log(config);
console.log(config.srsn);
console.log(config.srsn.br_code);
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var CashDepositRouter = require('./routes/cash_deposit');
var OtherDepositRouter = require('./routes/other_deposit');
var CashReceivableRouter = require('./routes/cash_receivable');
var CashWithdarwalRouter = require('./routes/cash_withdrawal');
var ReconWithdarwalRouter = require('./routes/recon_withdrawal');
var SalesBreakdownRouter = require('./routes/sales_breakdown');
var BankReconDeposit = require('./routes/bank_recon_deposit');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// START OF SESSIONS
var cookieParser = require('cookie-parser');
var session = require('express-session');

var MySQLStore = require('express-mysql-session')(session);

var options = {
	host: '192.168.0.91',
	port: 3306,
	user: 'root',
	password: 'srsnova',
	database: 'cash_deposit2',
	schema: {
		tableName: 'user_sessions',
		columnNames: {
			session_id: 'session_id',
			expires: 'expires',
			data: 'data'
		}
	}
};

var sessionStore = new MySQLStore(options);
app.use(session({
	key: 'session_cookie_name',
	secret: 'This_is_the_secret_code_used_to_sign_the_session_ID_cookie',
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}));

//var endSession = sessionStore.close();
// END OF SESSIONS

//I added this
var mysql = require("mysql");
//Remittance connection
app.use(function (req, res, next) {
	res.locals.mysql_connection_91 = mysql.createConnection({
		host: '192.168.0.91',
		user: 'root',
		password: 'srsnova',
		database: 'cash_deposit2'
	});
	res.locals.mysql_connection_91.connect();
	next();

});

//Central connection
app.use(function (req, res, next) {
	res.locals.remittance_connection = mysql.createConnection({
		host: '192.168.0.91',
		user: 'root',
		password: 'srsnova',
		database: 'cashier_remittance'
	});
	res.locals.remittance_connection.connect();
	next();
});
//END of I added this

//ARIA connection
app.use(function (req, res, next) {
	res.locals.aria_connection = mysql.createConnection({
		host: '192.168.0.91',
		user: 'root',
		password: 'srsnova',
		database: 'srs_aria_nova'
	});
	res.locals.aria_connection.connect();
	next();
});
//END of I added this

//I added this

var cors = require('cors')
//app.use(cors())
app.use(cors({
	origin: ['http://192.168.0.188:8888', 'http://localhost:8888'],
	//riki note: you cant capture the cookies if you use localhost on browser, use IP address.
	credentials: true, // enable set cookie
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}));


/*
app.use(function(req, res, next) {
	//res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Origin", "http://localhost:8888");
	res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
	res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	next();
});
*/

//END of I added this

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//****ROUTERS */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/cashdeposit', CashDepositRouter);
app.use('/otherdeposit', OtherDepositRouter);
app.use('/cashreceivable', CashReceivableRouter);
app.use('/cashwithdrawal', CashWithdarwalRouter);
app.use('/reconwithdrawal', ReconWithdarwalRouter);
app.use('/salesbreakdown', SalesBreakdownRouter);
app.use('/bankrecondeposit', BankReconDeposit);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

//I added this: to set my desired port.
var http = require('http');
module.exports = app;
var server = http.createServer(app);
server.listen(4001);
//END of I added this

module.exports = app;