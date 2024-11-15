const express = require("express");
const petController = require("../controllers/petController");
const uploadImage = require("../middlewares/multer");
const router = express.Router();

router.get("/register", petController.openPetRegister);

router.post("/register", uploadImage("pets-img"), petController.registerPet);

router.get("/onePet/:pet_owner_id/:pet_id", petController.openOnePet);

router.get("/editPet/:pet_owner_id/:pet_id/:img", petController.openEditPet);

router.post(
  "/editPet/:pet_owner_id/:pet_id/:img",
  uploadImage("pets-img"),
  petController.editPet
);

router.get("/logicDelete/:pet_owner_id/:pet_id", petController.logicDeletePet);

router.get("/totalDelete/:pet_owner_id/:pet_id", petController.totalDeletePet)

module.exports = router;
