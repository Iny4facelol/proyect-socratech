const connection = require("../config/db");

class IndexController {
  openIndex = (req, res) => {
    let sql = `SELECT pet_owner.pet_owner_name,pet.pet_owner_id AS id, pet.*, category.category_name
    FROM pet_owner
    JOIN pet ON pet_owner.pet_owner_id = pet.pet_owner_id
    LEFT JOIN category ON pet.category_id = category.category_id
    AND pet.pet_is_deleted = false 
    WHERE pet_owner.pet_owner_is_deleted = false
    `;

    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        console.log(result);
        res.render("index", { data: result });
      }
    });
  };
}

module.exports = new IndexController();
