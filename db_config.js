// db_config.js I made it.
const dbconfig = {
  programIP: "192.168.0.141",
  programPort: "8888", //UI port
  backendPort: "40011", //Back-end port

  user_login_connection: {
    //backend for users & user_session set to 91 or 43 or in branch server
    users_host: "localhost",
    users_user: "root",
    users_password: "srsnova",
    users_db: "cash_deposit2"
  },

  br_code_connection: [{
    br_code: "srsn",
    br_name: "NOVALICHES",
    central_host: "localhost",
    central_user: "root",
    central_password: "srsnova",
    central_db: "cash_deposit2",

    aria_host: "localhost",
    aria_user: "root",
    aria_password: "srsnova",
    aria_db: "srs_aria_graceville",

    remittance_host: "localhost",
    remittance_user: "root",
    remittance_password: "srsnova",
    remittance_db: "cashier_remittance"
  }, {
    br_code: 'srscain',
    br_name: 'CAINTA',
    central_host: 'localhost',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: 'localhost',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_graceville',

    remittance_host: '192.168.112.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  }

  ]
};

module.exports = dbconfig;