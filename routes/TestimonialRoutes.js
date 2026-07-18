const TestimonialRouter = require("express").Router();

const { authPublic, authBuyer } = require("../middlewares/authentication");

const {
  createRecord,
  getRecord,
  getSingleRecord,
  updateRecord,
  deleteRecord,
} = require("../controllers/TestimonialController");

TestimonialRouter.post("/", authBuyer, createRecord);
TestimonialRouter.get("/", authPublic, getRecord);
TestimonialRouter.get("/:_id", authPublic, getSingleRecord);
TestimonialRouter.put("/:_id", authBuyer, updateRecord);
TestimonialRouter.delete("/:_id", authBuyer, deleteRecord);

module.exports = TestimonialRouter;
