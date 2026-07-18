const Faq = require("../models/Faq");

async function createRecord(req, res) {
  try {
    let data = new Faq(req.body);
    await data.save();
    res.send({
      result: "Done",
      data: data,
    });
  } catch (error) {
    let arr = [];
    if (error?.keyValue)
      arr = Object.keys(error.keyValue).map((key) => [
        key,
        `${key} Already Taken`,
      ]);
    else
      arr = Object.keys(error?.errors).map((key) => [
        key,
        error.errors[key].message,
      ]);
    let errorMessage = Object.fromEntries(arr);
    res.status(Object.values(errorMessage).length ? 400 : 500).send({
      result: "Fail",
      reason: Object.values(errorMessage).length
        ? errorMessage
        : "Internal Server Error",
    });
  }
}

async function getRecord(req, res) {
  try {
    let data = await Faq.find().sort({ _id: -1 });
    res.send({
      result: "Done",
      count: data.length,
      data: data,
    });
  } catch (error) {
    res.send({
      result: "Failed",
      reason: "Internal Server Error",
    });
  }
}

async function getSingleRecord(req, res) {
  try {
    let data = await Faq.findOne({ _id: req.params._id });
    if (data) {
      res.send({
        result: "Done",
        data: data,
      });
    } else {
      res.status(404).send({
        result: "Fail",
        reason: "Record Not Found",
      });
    }
  } catch (error) {
    res.status(500).send({
      result: "Failed",
      reason: "Internal Server Error",
    });
  }
}

async function updateRecord(req, res) {
  try {
    let data = await Faq.findOne({ _id: req.params._id });
    if (data) {
      data.question = req.body.question ?? data.qestion;
      data.answer = req.body.answer ?? data.answer;
      data.description = req.body.description ?? data.description;
      data.status = req.body.status ?? data.status;
      await data.save();
      res.send({
        result: "Done",
        data: data,
      });
    } else {
      res.status(404).send({
        result: "Fail",
        reason: "Record Not Found",
      });
    }
  } catch (error) {
    let errorMessage = {};
    error?.keyValue && error?.keyValue?.qestion
      ? (errorMessage.question = "Faq Question is already exist")
      : "";
    res.status(Object.values(errorMessage).length ? 400 : 500).send({
      result: "Fail",
      reason: Object.values(errorMessage).length
        ? errorMessage
        : "Internal Server Error",
    });
  }
}

async function deleteRecord(req, res) {
  try {
    let data = await Faq.findOne({ _id: req.params._id });
    if (data) {
      await data.deleteOne();
      res.send({
        result: "Done",
      });
    } else {
      res.status(404).send({
        result: "Fail",
        reason: "Record Not Found",
      });
    }
  } catch (error) {
    res.status(500).send({
      result: "Failed",
      reason: "Internal Server Error",
    });
  }
}

module.exports = {
  createRecord: createRecord,
  getRecord: getRecord,
  getSingleRecord: getSingleRecord,
  updateRecord: updateRecord,
  deleteRecord: deleteRecord,
};
