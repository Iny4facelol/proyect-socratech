const connection = require("../config/db");

class CategoryController {
  openDogs = (req, res) => {
    let sql =
      "SELECT * FROM pet WHERE category_id = 1 AND pet_is_deleted = false";
    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.render("allDogs", { data: result });
      }
    });
  };
  openCats = (req, res) => {
    let sql =
      "SELECT * FROM pet WHERE category_id = 2 AND pet_is_deleted = false";
    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.render("allCats", { data: result });
      }
    });
  };
  openFerrets = (req, res) => {
    let sql =
      "SELECT * FROM pet WHERE category_id = 3 AND pet_is_deleted = false";
    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.render("allFerrets", { data: result });
      }
    });
  };
}

module.exports = new CategoryController();
