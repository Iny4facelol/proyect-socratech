const express = require("express");
const categoryController = require("../controllers/categoryController");
const router = express.Router();

router.get("/1", categoryController.openDogs);
router.get("/2", categoryController.openCats);
router.get("/3", categoryController.openFerrets);

module.exports = router;
