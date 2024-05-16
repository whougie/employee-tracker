class Role {
  constructor(pool) {
    this.pool = pool;
  }
  
  async getAll() {
    try {
      const result = await this.pool.query('SELECT role.id, role.title, department.name as department, role.salary FROM role INNER JOIN department ON role.department_id = department.id');
      return result.rows;
    } catch (error) {
      console.log(error);
    }
  }
  
  async addRole(title, salary, departmentId) {
    try {
      await this.pool.query(`INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)`, [title, salary, departmentId]);
      console.log("Successful added the new role of " + title);
    } catch (error) {
      if (error) {
        console.log(error);
      }
    }
  }
}

module.exports=Role;