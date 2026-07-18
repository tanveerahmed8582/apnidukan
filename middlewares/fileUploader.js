const multer = require("multer");

function uploader(folder) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `public/uploads/${folder}`);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });

  return multer({ storage: storage });
}

module.exports = {
  maincategoryUploader: uploader("maincategory"),
  subcategoryUploader: uploader("subcategory"),
  brandUploader: uploader("brand"),
  productUploader: uploader("product"),
  settingUploader: uploader("logo"),
};
