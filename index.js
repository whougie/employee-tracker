const pool = require('./config/connection');
const inquirer = require('inquirer');
const Department = require('./lib/department');
const Employee = require('./lib/employee');
const Role = require('./lib/role');
const asciiArt = require('ascii-art');

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
  displayOptions();
}

async function displayOptions() {
  const choices = ['View All Employees', 'Add an Employee', 'Update Employee Role', 'View All Departments', 'Add a Department', 'View All Roles', 'Add a Role']
  
  const rendered = await asciiArt.font("Employee Manager", 'doom').completed();
  
  console.log(asciiArt.style(rendered, "green", true));

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
  } else if (result.option === 'Update Employee Role') {
    await updateEmployeeRole();
  } else if (result.option === 'View All Departments') {
    console.table(await department.getAll());
  } else if (result.option === 'Add a Department') {
    await addDepartment();
  } else if (result.option === 'View All Roles') {
    console.table(await role.getAll());
  } else if (result.option === 'Add a Role') {
    await addRole();
  }
  
  displayOptions();
}


////
// Function Declarations
////
async function addRole() {
  const departments = await department.getAll();
  
  const result = await inquirer.prompt([ 
    {
    type: 'input',
    message: 'Please enter a new role: ',
    name: "newTitle"
  },
  {
    type: 'input',
    message: 'Please enter a salary for new role: ',
    name: "newSalary"
  },
  {
    type: 'list',
    message: "Please enter a department for new role: ",
    name: "newDepartment",
    choices: departments.map( (department) => department.name)
  }
]);
  
  const selectedDepartment = departments.filter( (department) => department.name === result.newDepartment)
  
  await role.addRole(result.newTitle, parseInt(result.newSalary), selectedDepartment[0].id);
}


async function addDepartment() {
  const result = await inquirer.prompt([
    {
      type: 'input',
      message: 'Please enter the new department: ',
      name: 'newDepartment'
    }
  ])
  await department.addDepartment(result.newDepartment);
}


async function updateEmployeeRole() {
  const roles = await role.getAll();
  const employees = await employee.getAll();
  
  const result = await inquirer.prompt([
    {
      type: 'list',
      message: 'Please select the employee to change his/her role: ',
      name: 'selectedEmployee',
      choices: employees.map( employee => {
        return employee.first_name + " " + employee.last_name
      })
    },
    {
      type: 'list',
      message: 'Please select the new role of the selected employee: ',
      name: 'selectedRole',
      choices: roles.map( role => role.title)
    }
  ])
  
  // Do a match of first and last name to find the selected employee
  const selectedEmployee = employees.filter( employee => {
    const firstAndLastName = result.selectedEmployee.split(' ');
    return employee.first_name === firstAndLastName[0] && employee.last_name === firstAndLastName[1];
  })
  
  //Do a match to find the role info using the role title
  const selectedRole = roles.filter( (role) => role.title === result.selectedRole );
  
  await employee.updateRole(selectedEmployee[0].id, selectedRole[0].id);
}

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
  
  await employee.addEmployee(result.firstName, result.lastName, result.selectedRole[0].id, result.selectedManager[0].id);
}