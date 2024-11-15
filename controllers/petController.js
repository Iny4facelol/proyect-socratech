const connection = require("../config/db");

class PetController {
  openPetRegister = (req, res) => {
    let sql = "SELECT * FROM category";
    let sql2 = "SELECT pet_owner_id, pet_owner_name FROM pet_owner";
    connection.query(sql, (errC, resultCategory) => {
      if (errC) {
        throw errC;
      } else {
        connection.query(sql2, (errO, resultOwner) => {
          if (errO) {
            throw errO;
          } else {
            console.log(resultOwner);
            res.render("petForm", {
              dataCategory: resultCategory,
              dataOwner: resultOwner,
            });
          }
        });
      }
    });
  };
  registerPet = (req, res) => {
    const { pet_name, pet_desc, category_id, pet_owner_id } = req.body;
    let values = [
      category_id,
      pet_owner_id,
      pet_name,
      pet_desc,
      req.file.filename,
    ];
    let sql =
      "INSERT INTO pet (category_id, pet_owner_id, pet_name, pet_desc, pet_img) VALUES (?,?,?,?,?)";
    connection.query(sql, values, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.redirect(`/categories/${category_id}`);
      }
    });
  };
}

module.exports = new PetController();
