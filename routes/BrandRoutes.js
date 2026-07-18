const BrandRouter = require("express").Router();
const { brandUploader } = require("../middlewares/fileUploader");
const {
  authSuperAdmin,
  authAdmin,
  authPublic,
} = require("../middlewares/authentication");

const {
  createRecord,
  getRecord,
  getSingleRecord,
  updateRecord,
  deleteRecord,
} = require("../controllers/BrandController");

BrandRouter.post("/", authAdmin, brandUploader.single("pic"), createRecord);
BrandRouter.get("/", authPublic, getRecord);
BrandRouter.get("/:_id", authPublic, getSingleRecord);
BrandRouter.put("/:_id", authAdmin, brandUploader.single("pic"), updateRecord);
BrandRouter.delete("/:_id", authSuperAdmin, deleteRecord);

module.exports = BrandRouter;
