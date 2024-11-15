const mysql = require("mysql2");

//Configurar la conexión con la base de datos.
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "pawfound"
});

connection.connect((err) => {
  if(err) {
    console.log(err);
    return;
  }
  console.log("Connected");
});

module.exports = connection;