const WishlistRouter = require("express").Router();

const { authBuyer } = require("../middlewares/authentication");

const {
  createRecord,
  getRecord,
  getSingleRecord,
  updateRecord,
  deleteRecord,
} = require("../controllers/WishlistController");

WishlistRouter.post("/", authBuyer, createRecord);
WishlistRouter.get("/user/:userid", authBuyer, getRecord);
WishlistRouter.get("/:_id", authBuyer, getSingleRecord);
WishlistRouter.put("/:_id", authBuyer, updateRecord);
WishlistRouter.delete("/:_id", authBuyer, deleteRecord);

module.exports = WishlistRouter;
