// db_config.js I made it.
const dbconfig = {

  programIP: '192.168.0.218',
  programPort: '8888',  //UI port
  backendPort: '8888',  //Back-end port

  user_login_connection: {   //backend for users & user_session set to 91 or 43 or in branch server
    users_host: '192.168.0.91',
    users_user: 'root',
    users_password: 'srsnova',
    users_db: 'cash_deposit2',
  },

  br_code_connection: [{
    br_code: 'srsn',
    br_name: 'NOVALICHES',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_nova',

    remittance_host: '192.168.0.91',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'sri',
    br_name: 'IMUS',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_imus',

    remittance_host: '192.168.108.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srsnav',
    br_name: 'NAVOTAS',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_navotas',

    remittance_host: '192.168.107.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srst',
    br_name: 'TONDO',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_tondo',

    remittance_host: '192.168.103.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srsc',
    br_name: 'CAMARIN',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_camarin',

    remittance_host: '192.168.106.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srsant1',
    br_name: 'QUEZON',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_antipolo_quezon',

    remittance_host: '192.168.110.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srsant2',
    br_name: 'MANALO',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_antipolo_manalo',

    remittance_host: '192.168.11.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srsm',
    br_name: 'MALABON',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_malabon',

    remittance_host: '192.168.101.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srsmr',
    br_name: 'MALABON KUSINA',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_malabon_rest',

    remittance_host: '192.168.101.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance_resto',
  },
  {
    br_code: 'srsg',
    br_name: 'GAGALANGIN',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_gala',

    remittance_host: '192.168.104.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srscain',
    br_name: 'CAINTA',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_cainta',

    remittance_host: '192.168.112.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srscain2',
    br_name: 'CAINTA 2',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_cainta_san_juan',

    remittance_host: '192.168.18.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srsval',
    br_name: 'VALENZUELA',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_navotas',

    remittance_host: '192.168.114.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srsbsl',
    br_name: 'BAGONG SILANG',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_b_silang',

    remittance_host: '192.168.113.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srspun',
    br_name: 'PUNTURIN',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_punturin_val',

    remittance_host: '192.168.115.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srspat',
    br_name: 'PATEROS',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_pateros',

    remittance_host: '192.168.116.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srscom',
    br_name: 'COMEMBO',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_comembo',

    remittance_host: '192.168.117.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srssanp',
    br_name: 'SAN PEDRO',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_san_pedro',

    remittance_host: '192.168.119.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srstu',
    br_name: 'LAS PINAS',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_talon_uno',

    remittance_host: '192.168.32.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srsal',
    br_name: 'ALAMINOS',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_alaminos',

    remittance_host: '192.168.20.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srsbgb',
    br_name: 'BAGUMBONG',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_bagumbong',

    remittance_host: '192.168.121.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srsgv',
    br_name: 'GRACEVILLE',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_graceville',

    remittance_host: '192.168.102.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srsmol',
    br_name: 'MOLINO',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_molino',

    remittance_host: '192.168.122.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srsman',
    br_name: 'MANGGAHAN',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_manggahan',

    remittance_host: '192.168.124.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srsmon',
    br_name: 'MONTALBAN',
    central_host: '192.168.0.91',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_montalban',

    remittance_host: '192.168.123.100',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srsisidro',
    br_name: 'SAN ISIDRO',
    central_host: '192.168.5.5',
    central_user: 'root',
    central_password: 'srsnova',
    central_db: 'cash_deposit2',

    aria_host: '192.168.0.91',
    aria_user: 'root',
    aria_password: 'srsnova',
    aria_db: 'srs_aria_san_isidro',

    remittance_host: '192.168.5.5',
    remittance_user: 'root',
    remittance_password: 'srsnova',
    remittance_db: 'cashier_remittance',
  },
  {
    br_code: 'srspalay',
    br_name: 'SAPANG PALAY',
    central_host: '192.168.5.4',
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