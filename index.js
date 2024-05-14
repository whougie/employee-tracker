const pool = require('./config/connection');
const inquirer = require('inquirer');
const Department = require('./lib/department');
const Employee = require('./lib/employee');
const Role = require('./lib/role');

const department = new Department(pool);
const employee = new Employee(pool);
const role = new Role(pool)

pool.connect(); // Startup DB

main();


/////
// Function Declarations
/////

// Created this function to help enforce the order of executions to the database
async function main() {


  // await employee.updateRole(3,4);
  // await employee.addEmployee('The', 'Man', 5);
  const emp = await employee.getAll();
  console.table(emp);
  
  console.log("Right before Role");
  // await role.addRole('TitleSeve', 173222, 7);
  const ro = await role.getAll();
  console.table(ro);
  console.log("Right before Department");
  //await department.addDepartment('TTZ');
  const dep = await department.getAll();
  console.table(dep);

  displayOptions();
}

function displayOptions() {
  const choices = ['View All Employees', 'Add an Employee', 'Update Employee Role', 'View All Departments', 'Add a Department', 'View All Roles', 'Add a Role']

  inquirer.prompt({
    type: 'list',
    message: 'Please select an option:',
    name: 'option',
    choices: choices
  })
  .then( data => {
    console.log(data.option);
  })
}

// Display options in inquirer
// -View all departments
//- View all roles
//- View all employees
//- Add a Role
// - Add and Employee
// - Update an employee role

// - Figure out how to collect the id when an employee is selected
// - Figure out how to collect the id when a role is selected

//---
// DB Functionalities
// XX -View all departments
// XX- View all roles
// XX - View all employees
// XX - Add a Role
// XX - Add and Employee
// XX - Update an employee role
// XX- Join Role table with Department
// XX- Join Employee table with Role table, Department table, and itself for the manager Id