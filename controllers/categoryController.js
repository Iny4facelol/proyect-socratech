const connection = require("../config/db");

class CategoryController {
  openDogs = (req, res) => {
    let sql = `
    SELECT pet.*, pet_owner.pet_owner_name,pet_owner.pet_owner_id,category.category_name FROM pet 
	  LEFT JOIN pet_owner ON pet.pet_owner_id = pet_owner.pet_owner_id 
	  LEFT JOIN category ON pet.category_id = category.category_id
    WHERE pet.category_id = 1 
    AND pet.pet_is_deleted = false`;

    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.render("allDogs", { data: result });
      }
    });
  };
  openCats = (req, res) => {
    let sql = `
    SELECT pet.*, pet_owner.pet_owner_name,category.category_name FROM pet 
	  LEFT JOIN pet_owner ON pet.pet_owner_id = pet_owner.pet_owner_id 
	  LEFT JOIN category ON pet.category_id = category.category_id
    WHERE pet.category_id = 2 
    AND pet.pet_is_deleted = false`;

    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.render("allCats", { data: result });
      }
    });
  };
  openFerrets = (req, res) => {
    let sql = `
    SELECT pet.*, pet_owner.pet_owner_name,category.category_name FROM pet 
	  LEFT JOIN pet_owner ON pet.pet_owner_id = pet_owner.pet_owner_id 
	  LEFT JOIN category ON pet.category_id = category.category_id
    WHERE pet.category_id = 3 
    AND pet.pet_is_deleted = false`;
    
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
