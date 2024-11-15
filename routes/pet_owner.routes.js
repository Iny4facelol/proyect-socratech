const express = require("express");
const router = express.Router();
const petOwnerController = require("../controllers/petOwnerController");
const uploadImage = require("../middlewares/multer");


router.get("/", petOwnerController.openOwner)

router.get("/register", petOwnerController.openRegisterForm);

router.post(
  "/register",
  uploadImage("owner-img"),
  petOwnerController.registerOwner
);

router.get("/login", petOwnerController.openLogin);

router.post("/login", petOwnerController.login);

router.get("/oneOwner/:id", petOwnerController.openOneOwner);


module.exports = router;
