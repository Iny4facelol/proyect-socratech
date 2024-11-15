const express = require("express");
const petController = require("../controllers/petController");
const uploadImage = require("../middlewares/multer");
const router = express.Router();

router.get("/register", petController.openPetRegister);

router.post("/register", uploadImage("dogs-img") ,petController.registerPet);

module.exports = router;
