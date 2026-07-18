const Setting = require("../models/Setting");
const fs = require("fs");

async function createRecord(req, res) {
  try {
    var data = await Setting.findOne();

    if (data) {
      data.map1 = req.body.map1;
      data.map2 = req.body.map2;
      data.siteName = req.body.siteName;
      data.address = req.body.address;
      data.email = req.body.email;
      data.phone = req.body.phone;
      data.whatsapp = req.body.whatsapp;
      data.facebook = req.body.facebook;
      data.twitter = req.body.twitter;
      data.linkedin = req.body.linkedin;
      data.instagram = req.body.instagram;
      data.youtube = req.body.youtube;
      data.privacyPolicy = req.body.privacyPolicy;
      data.termCondition = req.body.termCondition;
      if (req.files) {
        try {
          if (req.files.logoTop) fs.unlinkSync(data.logoTop);
        } catch (error) {}
        try {
          if (req.files.logoBottom) fs.unlinkSync(data.logoBottom);
        } catch (error) {}
        data.logoTop = req.files.logoTop
          ? req.files.logoTop[0]?.path
          : data.logoTop;
        data.logoBottom = req.files.logoBottom
          ? req.files.logoBottom[0]?.path
          : data.logoBottom;
      }
    } else {
      var data = new Setting(req.body);
      if (req.files) {
        data.logoTop = req.files.logoTop ? req.files.logoTop[0]?.path : "";
        data.logoBottom = req.files.logoBottom
          ? req.files.logoBottom[0]?.path
          : "";
      }
    }
    await data.save();
    res.send({
      result: "Done",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      result: "Fail",
      reason: "Internal Server Error",
    });
  }
}

async function getRecord(req, res) {
  try {
    let data = await Setting.find();
    res.send({
      result: "Done",
      data: data ?? {},
    });
  } catch (error) {
    res.send({
      result: "Failed",
      reason: "Internal Server Error",
    });
  }
}

module.exports = {
  createRecord: createRecord,
  getRecord: getRecord,
};
