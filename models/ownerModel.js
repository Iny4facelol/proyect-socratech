const connection = require("../config/db");

class OwnerModel {
  openOwnerQuery = (cb) => {
    let sql = "SELECT * FROM pet_owner WHERE pet_owner_is_deleted = false";
    connection.query(sql, cb);
  };
}

module.exports = new OwnerModel();