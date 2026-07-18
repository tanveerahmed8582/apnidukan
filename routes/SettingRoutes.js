const SettingRouter = require("express").Router();
const { settingUploader } = require("../middlewares/fileUploader");

const { createRecord, getRecord } = require("../controllers/SettingController");

SettingRouter.post(
  "/",
  settingUploader.fields([
    { name: "logoTop", maxCount: 1 },
    { name: "logoBottom", maxCount: 1 },
  ]),
  createRecord,
);
SettingRouter.get("/", getRecord);

module.exports = SettingRouter;
