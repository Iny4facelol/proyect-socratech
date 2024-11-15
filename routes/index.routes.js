const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");

router.get("/", indexController.openIndex);

router.get("/test", (req, res) => {
  res.render("test");
});

module.exports = router;
