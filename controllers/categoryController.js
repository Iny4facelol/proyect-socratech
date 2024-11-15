const connection = require("../config/db");

class CategoryController {
  openDogs = (req, res) => {
    let sql = "SELECT * FROM pet WHERE category_id = 1";
    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.render("allDogs", { data: result });
      }
    });
  };
  openCats = (req, res) => {
    res.render("allCats");
  };
  openFerrets = (req, res) => {
    res.render("allFerrets");
  };
}

module.exports = new CategoryController();
