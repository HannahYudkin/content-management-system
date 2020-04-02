const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root1234",
  database: "cms_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  runCMS();
});

function runCMS() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Add department, roles, or employee.",
        "View department, roles, or emlployees.",
        "Update empolyee",
        //"View list of employees by manager.",
        "Delete departments, roles, or employees."
        //"View itemized budget of department."
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "Add department, roles, or employee.":
          addItem();
          break;
        case "View department, roles, or emlployees.":
          viewDatabase();
          break;
        case "Update empolyee":
          updateEmployee();
          break;
        // case "View list of employees by manager.":
        //   viewEmployees();
        //   break;
        case "Delete departments, roles, or employees.":
          deleteItem();
          break;
        // case "View itemized budget of department.":
        //   viewItemization();
        //   break;
      }
    });
}

function addItem() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "Would you like to add a department, a role, or an employee?",
      choices: ["Add department", "Add role", "Add employee"]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "Add department":
          addDepartment();
          break;
        case "Add role":
          addRole();
          break;
        case "Add employee":
          addEmployee();
          break;
      }
    });
}

function viewDatabase() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "Would you like to view a department, a role, or an employee?",
      choices: ["View department", "View role", "View employee"]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View department":
          viewDepartment();
          break;
        case "View role":
          viewRole();
          break;
        case "View employee":
          viewEmployee();
          break;
      }
    });
}

async function updateEmployee() {
  let query = "SELECT role.id, role.title, role.department_id, employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id ";
  query += "FROM employee INNER JOIN role ON (employee.role_id = role.id)";

  const roles = await doQuery("SELECT * FROM role");
  const employees = await doQuery(query);

  const employeeChoices = [];
  employees.forEach(elem => {
    let currEmp = {
      name: `${elem.first_name} ${elem.last_name}`,
      value: elem.emp_id,
      short: elem.first_name
    };

    employeeChoices.push(currEmp);
  });

  const roleChoices = [];
  roles.forEach(elem => {
    let currRole = {
      name: `${elem.title}`,
      value: elem.id,
      short: elem.title
    };

    roleChoices.push(currRole);
  });

  inquirer
    .prompt([
      {
        name: "employee",
        type: "list",
        message: "Which employee you would like to update?",
        choices: employeeChoices
      },
      {
        name: "roleName",
        type: "list",
        message: "What is their new role?",
        choices: roleChoices
      }
    ])
    .then(function(answers) {
      console.log(answers)
      connection.query(
        "UPDATE employee SET ? WHERE ?",
        [
          {
            role_id: answers.roleName
          },
          {
            id: answers.employee
          }
        ],
        function(err) {
          if (err) throw err;
          console.log("\nEmployee role sucessfully updated!\n");
          runCMS();
        }
      );
    });
}


function deleteItem() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "Do you want to delete a department, a role, or an employee?",
      choices: ["Department", "Role", "employee"]
    })
    .then(function(answer) {
      if (answer.action === "Department") {
        let query = "SELECT * FROM department";
        //console.table();
        connection.query(query, function(err, res) {
          if (err) console.log(err);
          console.table(res);
          deleteDepartment();
        });
      }
    });
}

function viewItemization() {
  console.log("6");
}

function addDepartment() {
  inquirer
    .prompt({
      name: "action",
      type: "input",
      message: "What is the name of the new department?",
      validate: function validateDepartmentName(name) {
        if (name === "") {
          console.log("You must enter a valid name!");
          return false;
        } else {
          return true;
        }
      }
    })
    .then(function(answer) {
      let query = "INSERT INTO department SET ?";
      connection.query(
        query,
        {
          name: answer.action
        },
        function(err, res) {
          if (err) console.log(err);
          console.log("Department added successfully!");
          runCMS();
        }
      );
    });
}
function addRole() {
  connection.query("SELECT * FROM department", function(err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "name",
          type: "input",
          message: "What is the title of the new role?",
          validate: function validateRoleName(name) {
            if (name === "") {
              console.log("You must enter a valid role title!");
              return false;
            } else {
              return true;
            }
          }
        },
        {
          name: "salary",
          type: "input",
          message: "Enter salary: ",
          validate: function(value) {
            if (isNaN(parseInt(value)) === true) {
              return new Error(
                "Please delete your entry and enter a valid number!"
              );
            } else {
              return true;
            }
          }
        },
        {
          name: "dept",
          type: "rawlist",
          message: "Which department does this role belong in?",
          choices: function() {
            let deptArray = [];
            for (let i = 0; i < results.length; i++) {
              deptArray.push(results[i].name);
            }
            return deptArray;
          }
        }
      ])
      .then(function(answer) {
        let chosenDeptID;
        for (let i = 0; i < results.length; i++) {
          if (results[i].name === answer.dept) {
            chosenDeptID = results[i].id;
          }
        }
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.name,
            salary: answer.salary,
            department_id: chosenDeptID
          },
          function(err, res) {
            if (err) console.log(err);
            console.log("Role added successfully!");
            runCMS();
          }
        );
      });
  });
}

async function addEmployee() {
  let query =
    "SELECT employee.role_id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.id, role.title, role.salary, role.department_id, department.id, department.name ";
  query += "FROM employee JOIN role ON (employee.role_id = role.id)";
  query += "JOIN department ON (role.department_id = department.id)";

  const aRole = await doQuery("SELECT * FROM role");

  const aEmp = await doQuery(query);

  const aEmpChoices = [];
  aEmp.forEach(elem => {
    let currEmp = {
      name: `${elem.first_name} ${elem.last_name}`,
      value: elem.emp_id,
      short: elem.first_name
    };

    aEmpChoices.push(currEmp);
  });

  const aRoleChoices = [];
  aRole.forEach(elem => {
    let currRole = {
      name: `${elem.title}`,
      value: elem.id,
      short: elem.title
    };

    aRoleChoices.push(currRole);
  });

  inquirer
    .prompt([
      {
        name: "first",
        type: "input",
        message: "What is the first name of the new employee?",
        validate: function(value) {
          if (value === "") {
            return new Error("You must enter a valid name!");
          } else {
            return true;
          }
        }
      },
      {
        name: "last",
        type: "input",
        message: "What is the last name of the new employee?",
        validate: function(value) {
          if (value === "") {
            return new Error("You must enter a valid name!");
          } else {
            return true;
          }
        }
      },
      {
        name: "titleID",
        type: "list",
        message: "What is their position?",
        choices: aRoleChoices
      },
      {
        name: "manager",
        type: "list",
        message: "Who is their manager?",
        choices: aEmpChoices
      }
    ])
    .then(function(answers) {
      connection.query(
        "INSERT INTO employee SET ? ",
        [
          {
            first_name: answers.first,
            last_name: answers.last,
            role_id: answers.titleID,
            manager_id: answers.manager
          }
        ],
        function(err) {
          if (err) throw err;
          console.log("\nEmployee record sucessfully created!\n");
          runCMS();
        }
      );
    });
}

function viewDepartment() {
  let query = "SELECT * FROM department";
  connection.query(query, function(err, res) {
    if (err) console.log(err);
    console.table(res);
    runCMS();
  });

}

function viewRole() {
  let query = "SELECT * FROM role";
  connection.query(query, function(err, res) {
    if (err) console.log(err);
    console.table(res);
    runCMS();
  });

}

function viewEmployee() {
  let query = "SELECT * FROM employee";
  connection.query(query, function(err, res) {
    if (err) console.log(err);
    console.table(res);
    runCMS();
  });

}

function deleteDepartment() {
  inquirer
    .prompt({
      name: "id",
      type: "input",
      message: "What is the ID of the department you would like to delete?"
    })
    .then(function(answer) {
      connection.query(
        "DELETE FROM department WHERE ?",
        {
          id: answer.id
        },
        function(error, results, fields) {
          if (error) throw error;
          console.log("deleted " + results.affectedRows + " rows");
          runCMS();
        }
      );
    });
}

function doQuery(query1) {
  return new Promise(function(resolve, reject) {
    connection.query(query1, function(err, results) {
      if (err) reject(err);
      resolve(results);
    });
  });
}
