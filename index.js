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

async function displayOptions() {
  const choices = ['View All Employees', 'Add an Employee', 'Update Employee Role', 'View All Departments', 'Add a Department', 'View All Roles', 'Add a Role']
  
  const result = await inquirer.prompt([
    {
      type: 'list',
      message: 'Please select an option:',
      name: 'option',
      choices: choices
    }
  ])
  
  if (result.option === 'View All Employees') {
    console.table(await employee.getAll());
  } else if (result.option === 'Add an Employee') {
    await addEmployee();
  }
  
  displayOptions();
}


////
// Function Declarations
////

async function addEmployee () {
  const roles = await role.getAll();
  const managers = await employee.getAll();
  managers.unshift({first_name: "", last_name: ""})
  
  const result = await inquirer.prompt([
    {
      type: 'input',
      message: 'Please enter the first name of the new employee',
      name: 'firstName'
    },
    {
      type: 'input',
      message: 'Please enter the last name of the new employee',
      name: 'lastName'
    }, 
    {
      type: 'list',
      message: 'Please select the role of the new employee',
      name: 'selectedRole',
      choices: roles.map( role => role.title)
    },
    {
      type: 'list',
      message: 'Please select the manager of the new employee',
      name: 'selectedManager',
      choices: managers.map( manager => {
        if (manager.id === undefined) {
          return "None";
        } else {
          return manager.first_name + " " + manager.last_name
        }
      })
    }
  ])
  
  
  
  // setting result to hold the actual role object for the selected one instead of just the title
  const selectedRole = roles.filter( role => result.selectedRole === role.title);
  result.selectedRole = selectedRole;
  
  // setting result to hold the actual employee object for the selected one instead of just the first and last name
  
  if (result.selectedManager === 'None') {
    result.selectedManager = [managers[0]];
  } else {
    const selectedManager = managers.filter( manager => {
      const firstAndLastName = result.selectedManager.split(' ');
      return manager.first_name === firstAndLastName[0] && manager.last_name === firstAndLastName[1];
    })
    result.selectedManager = selectedManager;
  }
  console.log(result);
  
  await employee.addEmployee(result.firstName, result.lastName, result.selectedRole[0].id, result.selectedManager[0].id);
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