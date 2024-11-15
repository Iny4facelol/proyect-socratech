const multer = require('multer');

let uploadImage = (folder) => {
  const storage = multer.diskStorage({
    destination: `public/images/${folder}`,
    filename: function (req, file, cb) {
      console.log("Log en Multer: ", file);
      let finalName = `${Date.now()}-${file.originalname}`
      cb(null, finalName)
    }
  })

  const upload = multer({ storage: storage }).single("img");
  return upload;
}

module.exports = uploadImage;


// el MÉTODO SINGLE DE MULTER, NECESITA COMO PARÁMETRO EL NOMBRE DEL INPUT, QUE SU NOMBRE ES IMG.
// <input name="img" type="file">