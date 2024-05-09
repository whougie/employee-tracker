const pool = require('./config/connection');
const inquirer = require('inquirer');

pool.connect(); // Startup DB

