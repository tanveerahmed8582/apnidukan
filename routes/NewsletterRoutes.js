const NewsletterRouter = require("express").Router();

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
} = require("../controllers/NewsletterController");

NewsletterRouter.post("/", authPublic, createRecord);
NewsletterRouter.get("/", authAdmin, getRecord);
NewsletterRouter.get("/:_id", authAdmin, getSingleRecord);
NewsletterRouter.put("/:_id", authAdmin, updateRecord);
NewsletterRouter.delete("/:_id", authSuperAdmin, deleteRecord);

module.exports = NewsletterRouter;
