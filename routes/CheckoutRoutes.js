const CheckoutRouter = require("express").Router();

const {
  authBuyer,
  authAdmin,
  authSuperAdmin,
} = require("../middlewares/authentication");

const {
  createRecord,
  getRecord,
  getSingleRecord,
  updateRecord,
  deleteRecord,
  getUserRecord,
  order,
  verifyOrder,
} = require("../controllers/CheckoutController");

CheckoutRouter.post("/", authBuyer, createRecord);
CheckoutRouter.get("/", authAdmin, getRecord);
CheckoutRouter.get("/user/:userid", authBuyer, getUserRecord);
CheckoutRouter.get("/:_id", authBuyer, getSingleRecord);
CheckoutRouter.put("/:_id", authAdmin, updateRecord);
CheckoutRouter.delete("/:_id", authSuperAdmin, deleteRecord);
CheckoutRouter.post("/order", authBuyer, order);
CheckoutRouter.post("/verify-order", authBuyer, verifyOrder);

module.exports = CheckoutRouter;
