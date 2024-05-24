require('dotenv').config();
const {Pool} = require('pg');

const pool = new Pool(
  {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    host: 'localhost',
    database: process.env.DB_NAME
  },
);

module.exports=pool

