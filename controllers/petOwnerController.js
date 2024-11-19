const connection = require("../config/db");
const bcrypt = require("bcrypt");
const deleteFile = require("../utils/deleteFile");
const ownerModel = require("../models/ownerModel");



class PetOwnerController {
  openRegisterForm = (req, res) => {
    res.render("ownerForm");
  };
  registerOwner = (req, res) => {
    const {
      pet_owner_name,
      pet_owner_lastname,
      email,
      bio,
      address,
      phone_num,
      password,
      confirm_password,
    } = req.body;

    if (
      !pet_owner_name ||
      !email ||
      !bio ||
      !address ||
      !phone_num ||
      !password ||
      !confirm_password
    ) {
      res.render("ownerForm", {
        message: "Faltan campos obligatorios por completar",
      });
    } else {
      if (password == confirm_password) {
        bcrypt.hash(password, 10, (hashErr, hash) => {
          if (hashErr) {
            throw hashErr;
          } else {
            let values = [
              pet_owner_name,
              pet_owner_lastname,
              bio,
              address,
              phone_num,
              email,
              hash,
            ];
            let sql = `INSERT INTO pet_owner (pet_owner_name, pet_owner_lastname,bio,address,phone_num, email, password) VALUES (?)`;

            if (req.file) {
              sql = `INSERT INTO pet_owner (pet_owner_name, pet_owner_lastname,bio, address, phone_num, email, password, pet_owner_img) VALUES (?)`;
              values = [
                pet_owner_name,
                pet_owner_lastname,
                bio,
                address,
                phone_num,
                email,
                hash,
                req.file.filename,
              ];
            }

            connection.query(sql, [values], (err, result) => {
              if (err) {
                if (err.errno == 1062) {
                  res.render("ownerForm", {
                    messageEmail: "El email ya está en uso",
                  });
                } else {
                  throw err;
                }
              } else {
                res.redirect("/petOwners/login");
              }
            });
          }
        });
      } else {
        res.render("ownerForm", { message: "Las contraseñas no coinciden" });
      }
    }
  };
  openLogin = (req, res) => {
    res.render("login");
  };
  login = (req, res) => {
    const { email, password } = req.body;
    let sql =
      "SELECT * FROM pet_owner WHERE email = ? AND pet_owner_is_deleted = false";

    connection.query(sql, [email], (err, result) => {
      if (err) {
        throw err;
      } else {
        if (!result.length) {
          res.render("login", { message: "Los datos son incorrectos" });
        } else {
          bcrypt.compare(password, result[0].password, (err, resultCompare) => {
            if (!resultCompare) {
              res.render("login", { message: "Los datos son incorrectos" });
            } else {
              res.redirect(`/pets/register`);
            }
          });
        }
      }
    });
  };
  openOwner = (req, res) => {
    ownerModel.openOwnerQuery((err, result) => {
      if (err) {
        throw err;
      } else {
        res.render("owner", { data: result });
      }
    });
  };
  openOneOwnerPro = (req, res) => {
    const { id } = req.params;
    let sql = `SELECT pet_owner.*, pet.pet_owner_id AS id, pet.*
    FROM pet_owner
    LEFT JOIN pet
    ON pet_owner.pet_owner_id = pet.pet_owner_id
    AND pet.pet_is_deleted = false 
    WHERE pet_owner.pet_owner_is_deleted = false
    AND pet_owner.pet_owner_id = ?
    `;

    connection.query(sql, [id], (err, result) => {
      if (err) {
        throw err;
      } else {
        let finalResult = {};
        let pets = [];
        let pet = {};
        result.forEach((e) => {
          if (e.pet_id) {
            pet = {
              pet_id: e.pet_id,
              pet_owner_id: e.pet_owner_id,
              pet_name: e.pet_name,
              pet_desc: e.pet_desc,
              pet_img: e.pet_img,
            };
            pets.push(pet);
          }
        });

        finalResult = {
          pet_owner_id: id,
          pet_owner_name: result[0].pet_owner_name,
          pet_owner_lastname: result[0].pet_owner_lastname,
          bio: result[0].bio,
          address: result[0].address,
          phone_num: result[0].phone_num,
          email: result[0].email,
          pet_owner_img: result[0].pet_owner_img,
          pets,
        };

        res.render("oneOwner", { finalResult });
      }
    });
  };
  openEditOwner = (req, res, next) => {
    const { id } = req.params;
    let sql =
      "SELECT * FROM pet_owner WHERE pet_owner_id = ? AND pet_owner_is_deleted = false";

    connection.query(sql, [id], (err, result) => {
      if (err) {
        throw err;
      } else {
        if (result.length == 0) {
          next();
        } else {
          res.render("editOwner", { data: result[0] });
        }
      }
    });
  };
  editOwner = (req, res) => {
    const { id, img } = req.params;
    const { pet_owner_name, pet_owner_lastname, bio, address, phone_num } =
      req.body;
    console.log(req.body);

    if (!pet_owner_name || !bio || !address || !phone_num) {
      let data = {
        pet_owner_id: id,
        pet_owner_name: pet_owner_name,
        pet_owner_lastname: pet_owner_lastname,
        bio: bio,
        address: address,
        phone_num: phone_num,
        pet_owner_img: img,
      };
      res.render("editOwner", { data, message: "Faltan campos por completar" });
    } else {
      let values = [
        pet_owner_name,
        pet_owner_lastname,
        bio,
        address,
        phone_num,
        img,
        id,
      ];
      let sql =
        "UPDATE pet_owner SET pet_owner_name = ?, pet_owner_lastname = ?, bio = ?, address = ?, phone_num = ?, pet_owner_img = ? WHERE pet_owner_id = ?";

      if (req.file) {
        values[5] = req.file.filename;
        sql =
          "UPDATE pet_owner SET pet_owner_name = ?, pet_owner_lastname = ?, bio = ?, address = ?, phone_num = ?, pet_owner_img = ? WHERE pet_owner_id = ?";
      }

      connection.query(sql, values, (err, result) => {
        if (err) {
          throw err;
        } else {
          if (req.file != "null" && req.file != undefined) {
            console.log(req.file);
            deleteFile(img, "owner-img");
          }
          res.redirect(`/petOwners/oneOwner/${id}`);
        }
      });
    }
  };
  logicDelete = (req, res) => {
    const { pet_owner_id } = req.params;
    let sql =
      "UPDATE pet_owner LEFT JOIN pet ON pet_owner.pet_owner_id = pet.pet_owner_id SET pet_owner.pet_owner_is_deleted = true, pet.pet_is_deleted = true WHERE pet_owner.pet_owner_id = ?";

    connection.query(sql, [pet_owner_id], (err, result) => {
      if (err) {
        throw err;
      } else {
        res.redirect("/petOwners");
      }
    });
  };
  totalDelete = (req, res) => {
    const { pet_owner_id } = req.params;
    let sqlImg =
      "SELECT o.pet_owner_img, GROUP_CONCAT(p.pet_img SEPARATOR ',') AS images FROM pet_owner o LEFT JOIN pet p ON o.pet_owner_id = p.pet_id WHERE o.pet_owner_id = ?";

    let sqlDel = "DELETE FROM pet_owner WHERE pet_owner_id = ?";

    connection.query(sqlImg, [pet_owner_id], (errImg, resultImg) => {
      if (errImg) {
        throw errImg;
      } else {
        let ownerImg = resultImg[0].pet_owner_img;
        let petsImg = [];
        if (resultImg[0].images) {
          petsImg = resultImg[0].images.split(",");
        }
        connection.query(sqlDel, [pet_owner_id], (errDel, resultDel) => {
          if (errDel) {
            throw errDel;
          } else {
            if (ownerImg) {
              deleteFile(ownerImg, "owner-img");
            }

            for (const img of petsImg) {
              deleteFile(img, "pets-img");
            }

            res.redirect("/petOwners");
          }
        });
      }
    });
  };
}

module.exports = new PetOwnerController();
