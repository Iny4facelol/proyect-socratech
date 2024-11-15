const express = require("express");
const router = express.Router();
const petOwnerController = require("../controllers/petOwnerController");
const uploadImage = require("../middlewares/multer");

router.get("/", petOwnerController.openOwner);

router.get("/register", petOwnerController.openRegisterForm);

router.post(
  "/register",
  uploadImage("owner-img"),
  petOwnerController.registerOwner
);

router.get("/login", petOwnerController.openLogin);

router.post("/login", petOwnerController.login);

router.get("/oneOwner/:id", petOwnerController.openOneOwnerPro);

router.get("/editOwner/:id/:img", petOwnerController.openEditOwner);

router.post(
  "/editOwner/:id/:img",
  uploadImage("owner-img"),
  petOwnerController.editOwner
);

router.get("/logicDelete/:pet_owner_id", petOwnerController.logicDelete);

router.get("/totalDelete/:pet_owner_id", petOwnerController.totalDelete);

module.exports = router;
