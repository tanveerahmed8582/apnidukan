const CartRouter = require("express").Router();

const { authBuyer } = require("../middlewares/authentication");

const {
  createRecord,
  getRecord,
  getSingleRecord,
  updateRecord,
  deleteRecord,
} = require("../controllers/CartController");

CartRouter.post("/", authBuyer, createRecord);
CartRouter.get("/user/:userid", authBuyer, getRecord);
CartRouter.get("/:_id", authBuyer, getSingleRecord);
CartRouter.put("/:_id", authBuyer, updateRecord);
CartRouter.delete("/:_id", authBuyer, deleteRecord);

module.exports = CartRouter;
