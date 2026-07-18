const ProductRouter = require("express").Router();
const { productUploader } = require("../middlewares/fileUploader");

const {
  authPublic,
  authAdmin,
  authSuperAdmin,
  authBuyer,
} = require("../middlewares/authentication");

const {
  createRecord,
  getRecord,
  getSingleRecord,
  updateRecord,
  deleteRecord,
} = require("../controllers/ProductController");

ProductRouter.post("/", authAdmin, productUploader.array("pic"), createRecord);
ProductRouter.get("/", authPublic, getRecord);
ProductRouter.get("/:_id", authPublic, getSingleRecord);
ProductRouter.put(
  "/:_id",
  authBuyer,
  productUploader.array("pic"),
  updateRecord,
);
ProductRouter.delete("/:_id", authSuperAdmin, deleteRecord);

module.exports = ProductRouter;
