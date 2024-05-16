class Employee {
  constructor(pool) {
    this.pool = pool;
  }
  
  async getAll() {
    try {
    const result = await this.pool.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, concat(manager_table.first_name, ' ', manager_table.last_name) as manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee as manager_table ON employee.manager_id = manager_table.id`);
    return result.rows;
    } catch (error) {
      console.log(error);
    }
  }

  // async getEmployee(name) {
  //   try {
  //     const result = await this.pool.query(`SELECT * FROM employee WHERE first_name = firstName AND last_name = lastName`);
  //   } catch (error) {
  //     if (error) {
  //       console.log(error);
  //     }
  // }

  async addEmployee(firstName, lastName, roleId, managerId) {
    try {
      await this.pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, [firstName, lastName, roleId, managerId]);
      console.log(`Successful added new employee ${firstName} ${lastName}`);
    } catch (error) {
      if (error) 
        console.log(error);
    }
  }

  async updateRole(id, roleId) {
    try {
      await this.pool.query(`UPDATE employee SET role_id = $1 WHERE id = $2`, [roleId, id]);
      console.log("Successfully modified employee ID " + id);
    } catch (error) {
      if (error) {
        console.log(error);
      }
    }
  }
}

module.exports=Employee;
