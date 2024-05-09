\c company_db;

INSERT INTO department (name) 
VALUES 
('HR'),
('IT'),
('Administration'),
('Accounting'),
('Development'),
('Security');


INSERT INTO role (title, salary, department_id)
VALUES
('software developer', 120000, 5),
('finance specialist', 75000, 4),
('secetary', 55000, 3),
('HR specialist', 65000, 1),
('Linux Admin', 100000, 2),
('Manager', 150000, 5),
('Site Security Engineer', 140000, 6);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('W', 'Lo', 1, 2),
('A', 'Lo', 6, NULL),
('H', 'Lo', 5, 2),
('L', 'Lo', 7, 2),
('B', 'Lo', 2, NULL),
('Br', 'Lo', 3, NULL),
('N', 'Lo', 4, NULL);