const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

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
        "View list of employees by manager.",
        "Delete departments, roles, or employees.",
        "View itemized budget of department."
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
        case "View list of employees by manager.":
          viewEmployees();
          break;
        case "Delete departments, roles, or employees.":
          deleteItem();
          break;
        case "View itemized budget of department.":
          viewItemization();
          break;
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
          addrole();
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

function updateEmployee() {
  console.log("3");
}

function viewEmployees() {
  console.log("4");
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
      console.log(answer.action);
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
//************FIX LATER */
function addrole() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the title of the new role?",
        validate: function validateRole(name) {
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
              "Please delete your entry and enter a valid salary(number)."
            );
          } else {
            return true;
          }
        }
      }
    ])
    .then(function(answer) {
      console.table(answer);
      console.log("Success");
      // let query = "INSERT INTO role SET ?";
      // connection.query(
      //   query,
      //   {
      //     name: answer.action
      //   },
      //   function(err, res) {
      //     if (err) console.log(err);
      //     console.log("Department added successfully!");
      //     runCMS();
      // }
    });
}

function addEmployee() {
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
      }
    ])
    .then(function(answer) {
      console.log("COOL.");
    });
}

function viewDepartment() {
  let query = "SELECT * FROM department";
  connection.query(query, function(err, res) {
    if (err) console.log(err);
    console.table(res);
  });
}

function viewRole() {}

function viewEmployee() {}

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
        }
      );
    });
}
