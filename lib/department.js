class Department {
  constructor(pool) {
    this.pool = pool;
  }
  
  async getAll() {
    try {
      const result = await this.pool.query('SELECT * FROM department');
      return result.rows;
    } catch (error) {
      console.log(error);
    }
  }
  
  async addDepartment(name) {
    try {
    await this.pool.query(`INSERT INTO department (name) VALUES ($1)`, [name])
    console.log("Successfully added the new " + name + " department");
    } catch (error) {
      if (error) 
        console.log(error);
    }
  }
}

module.exports=Department;