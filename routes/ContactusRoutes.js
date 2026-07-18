const ContactusRouter = require("express").Router();

const {
  authPublic,
  authAdmin,
  authSuperAdmin,
} = require("../middlewares/authentication");

const {
  createRecord,
  getRecord,
  getSingleRecord,
  updateRecord,
  deleteRecord,
} = require("../controllers/ContactusController");

ContactusRouter.post("/", authPublic, createRecord);
ContactusRouter.get("/", authAdmin, getRecord);
ContactusRouter.get("/:_id", authAdmin, getSingleRecord);
ContactusRouter.put("/:_id", authAdmin, updateRecord);
ContactusRouter.delete("/:_id", authSuperAdmin, deleteRecord);

module.exports = ContactusRouter;
