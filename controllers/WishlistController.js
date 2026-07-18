const Wishlist = require("../models/Wishlist");

async function createRecord(req, res) {
  try {
    let data = new Wishlist(req.body);
    await data.save();
    let finalData = await Wishlist.findOne({ _id: data._id })
      .populate("user", ["name"])
      .populate({
        path: "product",
        select: "name brand color size finalPrice stockQuantity stock pic",
        populate: {
          path: "brand",
          select: "-_id name",
        },
        options: {
          slice: {
            pic: 1,
          },
        },
      });
    res.send({
      result: "Done",
      data: finalData,
    });
  } catch (error) {
    console.log(error.message);
    let errorMessage = Object.fromEntries(
      Object.keys(error?.errors).map((key) => [key, error.errors[key].message]),
    );
    // let errorMessage = {};

    // error?.errors?.name
    //   ? (errorMessage.name = error?.errors?.name.message)
    //   : "";
    // error?.errors?.maincategory
    //   ? (errorMessage.maincategory = error?.errors?.maincategory.message)
    //   : "";
    // error?.errors?.subcategory
    //   ? (errorMessage.subcategory = error?.errors?.subcategory.message)
    //   : "";
    // error?.errors?.brand
    //   ? (errorMessage.brand = error?.errors?.brand.message)
    //   : "";
    // error?.errors?.color
    //   ? (errorMessage.color = error?.errors?.color.message)
    //   : "";
    // error?.errors?.size
    //   ? (errorMessage.size = error?.errors?.size.message)
    //   : "";
    // error?.errors?.basePrice
    //   ? (errorMessage.basePrice = error?.errors?.basePrice.message)
    //   : "";
    // error?.errors?.discount
    //   ? (errorMessage.discount = error?.errors?.discount.message)
    //   : "";
    // error?.errors?.finalPrice
    //   ? (errorMessage.finalPrice = error?.errors?.finalPrice.message)
    //   : "";
    // error?.errors?.stockQuantity
    //   ? (errorMessage.stockQuantity = error?.errors?.stockQuantity.message)
    //   : "";
    // error?.errors?.pic ? (errorMessage.pic = error?.errors?.pic.message) : "";
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
    let data = await Wishlist.find({ user: req.params.userid })
      .populate("user", ["name"])
      .populate({
        path: "product",
        select: "name brand color size finalPrice stockQuantity stock pic",
        populate: {
          path: "brand",
          select: "-_id name",
        },
        options: {
          slice: {
            pic: 1,
          },
        },
      })
      .sort({ _id: -1 });
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
    let data = await Wishlist.findOne({ _id: req.params._id })
      .populate("user", ["name"])
      .populate({
        path: "product",
        select: "name brand color size finalPrice stockQuantity stock pic",
        populate: {
          path: "brand",
          select: "-_id name",
        },
        options: {
          slice: {
            pic: 1,
          },
        },
      });
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
    let data = await Wishlist.findOne({ _id: req.params._id });
    if (data) {
      await data.save();

      // if ((await data.save()) && req.file) {
      //   try {
      //     fs.unlinkSync(data.pic);
      //   } catch (error) {}
      //   data.pic = req.file.path;
      //   await data.save();
      // }
      let finalData = await Wishlist.findOne({ _id: data._id })
        .populate("user", ["name"])
        .populate({
          path: "product",
          select: "name brand color size finalPrice stockQuantity stock pic",
          populate: {
            path: "brand",
            select: "-_id name",
          },
          options: {
            slice: {
              pic: 1,
            },
          },
        });
      res.send({
        result: "Done",
        data: finalData,
      });
    } else {
      res.status(404).send({
        result: "Fail",
        reason: "Record Not Found",
      });
    }
  } catch (error) {
    let errorMessage = Object.fromEntries(
      Object.keys(error?.errors).map((key) => [key, error.errors[key].message]),
    );
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
    let data = await Wishlist.findOne({ _id: req.params._id });
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
