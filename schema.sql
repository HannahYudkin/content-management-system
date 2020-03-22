DROP DATABASE IF EXISTS cms_db;
CREATE DATABASE cms_db;

USE cms_db;


CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NULL,
  PRIMARY KEY(id)
);

CREATE TABLE role (
  id INT NOT NULL,
  title VARCHAR(30) NULL,
  salary DECIMAL NULL,
  department_id INT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (department_id) 
  REFERENCES department(id)
  ON UPDATE CASCADE ON RESTRICT CASCADE
);

CREATE TABLE employee (
  id INT NOT NULL,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (role_id) 
  REFERENCES role(id)
  ON UPDATE CASCADE ON RESTRICT CASCADE,
  FOREIGN KEY (manager_id) 
  REFERENCES employee(id)
);


