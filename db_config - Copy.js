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
  },
  {
    br_code: 'srsisidro',
    br_name: 'SAN ISIDRO',
    central_host: 'localhost',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_san_isidro',

    remittance_host: '192.168.126.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srspalay',
    br_name: 'SAPANG PALAY',
    central_host: 'localhost',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_s_palay',

    remittance_host: '192.168.5.4',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  }

  ]
};

module.exports = dbconfig;