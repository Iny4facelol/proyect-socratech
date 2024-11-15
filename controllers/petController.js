const connection = require("../config/db");
const deleteFile = require("../utils/deleteFile");

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
    let values = [category_id, pet_owner_id, pet_name, pet_desc];
    let sql =
      "INSERT INTO pet (category_id, pet_owner_id, pet_name, pet_desc) VALUES (?,?,?,?)";

    if (req.file) {
      sql =
        "INSERT INTO pet (category_id, pet_owner_id, pet_name, pet_desc, pet_img) VALUES (?,?,?,?,?)";
      values.push(req.file.filename);
    }
    connection.query(sql, values, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.redirect(`/categories/${category_id}`);
      }
    });
  };
  openOnePet = (req, res) => {
    const { pet_owner_id, pet_id } = req.params;
    let values = [pet_owner_id, pet_id];
    let sql = `SELECT pet_owner.pet_owner_name,pet_owner.address,pet_owner.phone_num, pet.pet_owner_id AS id, pet.*, category.category_name
    FROM pet_owner
    LEFT JOIN pet ON pet_owner.pet_owner_id = pet.pet_owner_id
    LEFT JOIN category ON pet.category_id = category.category_id
    AND pet.pet_is_deleted = false 
    WHERE pet_owner.pet_owner_is_deleted = false
    AND pet_owner.pet_owner_id = ? 
    AND pet.pet_id = ?
    `;

    connection.query(sql, values, (err, result) => {
      if (err) {
        throw err;
      } else {
        console.log(result);

        res.render("onePet", { data: result[0] });
      }
    });
  };
  openEditPet = (req, res) => {
    const { pet_id } = req.params;
    let sql = `SELECT pet_owner.pet_owner_name,pet.pet_owner_id AS id, pet.*, category.category_name
    FROM pet_owner
    JOIN pet ON pet_owner.pet_owner_id = pet.pet_owner_id
    LEFT JOIN category ON pet.category_id = category.category_id
    AND pet.pet_is_deleted = false 
    WHERE pet_owner.pet_owner_is_deleted = false
    AND pet.pet_id = ?
    `;

    connection.query(sql, [pet_id], (err, result) => {
      if (err) {
        throw err;
      } else {
        console.log(result);
        res.render("editPet", { data: result[0] });
      }
    });
  };
  editPet = (req, res) => {
    const { pet_owner_id, pet_id, img } = req.params;
    const { pet_name, pet_desc } = req.body;
    console.log(req.body);

    if (!pet_name || !pet_desc) {
      console.log("hola");

      let data = {
        pet_name,
        pet_desc,
        pet_img: img,
        pet_id,
      };
      res.render("editPet", { data, message: "Faltan campos por completar" });
    } else {
      let values = [pet_name, pet_desc, img, pet_id];
      let sql =
        "UPDATE pet SET pet_name = ?, pet_desc = ?, pet_img = ? WHERE pet_id = ?";

      if (req.file) {
        values[2] = req.file.filename;
        sql =
          "UPDATE pet SET pet_name = ?, pet_desc = ?, pet_img = ? WHERE pet_id = ?";
      }

      connection.query(sql, values, (err, result) => {
        if (err) {
          throw err;
        } else {
          if (req.file != "null" && req.file != undefined) {
            console.log("PET EDIT", req.file);
            deleteFile(img, "pets-img");
          }
          res.redirect(`/petOwners/oneOwner/${pet_owner_id}`);
        }
      });
    }
  };
  logicDeletePet = (req, res) => {
    const { pet_owner_id, pet_id } = req.params;
    let sql = "UPDATE pet SET pet_is_deleted = true WHERE pet_id = ?";
    connection.query(sql, [pet_id], (err, result) => {
      if (err) {
        throw err;
      } else {
        res.redirect(`/petOwners/oneOwner/${pet_owner_id}`);
      }
    });
  };
  totalDeletePet = (req, res) => {
    const { pet_owner_id, pet_id } = req.params;
    let sqlImg = "SELECT pet_img FROM pet WHERE pet_id = ?";
    connection.query(sqlImg, [pet_id], (errImg, resultImg) => {
      if(errImg){
        throw errImg
      } else {
        const petImg = resultImg[0]?.pet_img;
        
        let sqlDel = "DELETE FROM pet WHERE pet_id = ?"
        connection.query(sqlDel, [pet_id], (errDel,resultDel) => {
          if(errDel) {
            throw errDel
          } else {
            if(petImg) {
              deleteFile(petImg, "pets-img")
            } 

            res.redirect(`/petOwners/oneOwner/${pet_owner_id}`)
          }
        })

      }
    });
  };
}

module.exports = new PetController();
