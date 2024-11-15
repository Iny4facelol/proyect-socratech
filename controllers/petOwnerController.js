const connection = require("../config/db");
const bcrypt = require("bcrypt");

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
    let sql = "SELECT * FROM pet_owner WHERE pet_owner_is_deleted = false";
    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.render("owner", { data: result });
      }
    });
  };
  openOneOwner = (req, res) => {
    const { id } = req.params;

    let sql =
      "SELECT * FROM pet_owner WHERE pet_owner_is_deleted = false AND pet_owner_id = ?";

    connection.query(sql, [id], (err, result) => {
      if (err) {
        throw err;
      } else {
        res.render("oneOwner", { data: result[0] });
      }
    });
  };
}

module.exports = new PetOwnerController();
