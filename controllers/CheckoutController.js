const Checkout = require("../models/Checkout");
const mailer = require("../mailer/index");
const Razorpay = require("razorpay");

//Payment API
async function order(req, res) {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.json({ data: order });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
}

async function verifyOrder(req, res) {
  try {
    var check = await Checkout.findOne({ _id: req.body.checkid });
    check.rppid = req.body.razorpay_payment_id;
    check.paymentStatus = "Done";
    check.paymentMode = "Net Banking";
    await check.save();
    res.status(200).send({ result: "Done", message: "Payment SuccessFull" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
}

async function createRecord(req, res) {
  try {
    let data = new Checkout(req.body);
    await data.save();
    let finalData = await Checkout.findOne({ _id: data._id })
      .populate("user", ["name", "username", "email", "phone"])
      .populate({
        path: "products.product",
        select: "name brand finalPrice stockQunatity stock pic",
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

    console.log("Recipient:", finalData.deliveryAddress.email);

    mailer.sendMail(
      {
        from: process.env.MAILER,
        to: finalData.deliveryAddress.email,
        subject: `Order Confirmed | ${process.env.SITE_NAME}`,
        html: `
          <div style="margin:0;padding:20px;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">

        <div style="max-width:600px;margin:auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">

      <div style="background:#001f54;padding:25px;text-align:center;">
        <h1 style="margin:0;color:#ffffff;font-size:28px;">
          ${process.env.SITE_NAME}
        </h1>
      </div>

      <div style="padding:35px;">

        <h2 style="margin-top:0;color:#001f54;">
          🎉 Order Successfully Placed
        </h2>

        <p style="color:#333333;font-size:16px;line-height:1.8;">
          Hello <strong>${finalData.user.name}</strong>,
        </p>

        <p style="color:#333333;font-size:16px;line-height:1.8;">
          Thank you for shopping with <strong>${process.env.SITE_NAME}</strong>.
          Your order has been successfully placed and is now being processed by our team.
        </p>

        <div style="background:#f8f9fc;border-left:4px solid #001f54;padding:20px;margin:25px 0;">

          <p style="margin:0 0 12px 0;color:#333333;font-size:15px;">
            <strong>Order ID:</strong> ${finalData._id}
          </p>

          <p style="margin:0 0 12px 0;color:#333333;font-size:15px;">
            <strong>Order Status:</strong> ${finalData.orderStatus}
          </p>

          <p style="margin:0 0 12px 0;color:#333333;font-size:15px;">
            <strong>Payment Method:</strong> ${finalData.paymentMode}
          </p>

          <p style="margin:0 0 12px 0;color:#333333;font-size:15px;">
            <strong>Payment Status:</strong> ${finalData.paymentStatus}
          </p>

          <p style="margin:0;color:#333333;font-size:15px;">
            <strong>Total Amount:</strong> ₹${finalData.total}
          </p>

        </div>

        <p style="color:#333333;font-size:16px;line-height:1.8;">
          Our team will begin preparing your order shortly. You will receive another email when your order is shipped.
        </p>

        <div style="text-align:center;margin:35px 0;">
          <a
            href="${process.env.SITE_URL}"
            style="
              display:inline-block;
              background:#001f54;
              color:#ffffff;
              text-decoration:none;
              padding:14px 32px;
              border-radius:6px;
              font-size:16px;
              font-weight:bold;
            "
          >
            Continue Shopping
          </a>
        </div>

        <div style="background:#f8f9fc;border-left:4px solid #001f54;padding:15px;margin-top:25px;">
          <p style="margin:0;color:#555555;font-size:14px;line-height:1.6;">
            If you have any questions regarding your order, feel free to contact our support team.
          </p>
        </div>

        <p style="margin-top:30px;color:#333333;font-size:16px;">
          Regards,<br>
          <strong>${process.env.SITE_NAME} Team</strong>
        </p>

      </div>

      <div style="background:#001f54;padding:15px;text-align:center;">
        <p style="margin:0;color:#ffffff;font-size:13px;">
          © ${new Date().getFullYear()} ${process.env.SITE_NAME}. All Rights Reserved.
        </p>
      </div>

        </div>

      </div>

          `,
      },
      (error, info) => {
        if (error) {
          console.log("❌ Mail Sending Failed");
          console.log(error.message);
        } else {
          console.log("✅ Mail Sent Successfully");
          console.log(info.response);
        }
      },
    );
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
    // error?.errors?.stockQunatity
    //   ? (errorMessage.stockQunatity = error?.errors?.stockQunatity.message)
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
    let data = await Checkout.find()
      .populate("user", ["name", "username", "email", "phone"])
      .populate({
        path: "products.product",
        select: "name brand finalPrice stockQunatity stock pic",
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
async function getUserRecord(req, res) {
  try {
    let data = await Checkout.find({ user: req.params.userid })
      .populate("user", ["name", "username", "email", "phone"])
      .populate({
        path: "products.product",
        select: "name brand finalPrice stockQunatity stock pic",
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
    let data = await Checkout.findOne({ _id: req.params._id })
      .populate("user", ["name", "username", "email", "phone"])
      .populate({
        path: "products.product",
        select: "name brand finalPrice stockQunatity stock pic",
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
    let data = await Checkout.findOne({ _id: req.params._id });
    if (data) {
      data.orderStatus = req.body.orderStatus ?? data.orderStatus;
      data.paymentMode = req.body.paymentMode ?? data.paymentMode;
      data.paymentStatus = req.body.paymentStatus ?? data.paymentStatus;
      data.rppid = req.body.rppid ?? data.rppid;

      await data.save();

      // if ((await data.save()) && req.file) {
      //   try {
      //     fs.unlinkSync(data.pic);
      //   } catch (error) {}
      //   data.pic = req.file.path;
      //   await data.save();
      // }
      let finalData = await Checkout.findOne({ _id: data._id })
        .populate("user", ["name", "username", "email", "phone"])
        .populate({
          path: "products.product",
          select: "name brand finalPrice stockQunatity stock pic",
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

      mailer.sendMail(
        {
          from: process.env.MAILER,
          to: finalData.deliveryAddress.email,
          subject: `Order Status Updated | ${process.env.SITE_NAME}`,
          html: `
          <div style="margin:0;padding:20px;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
          <div style="max-width:600px;margin:auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <div style="background:#001f54;padding:25px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:28px;">
            ${process.env.SITE_NAME}
          </h1>
        </div>

        <div style="padding:35px;">

          <h2 style="margin-top:0;color:#001f54;">
            📦 Order Status Updated
          </h2>

          <p style="color:#333333;font-size:16px;line-height:1.8;">
            Hello <strong>${finalData.user.name}</strong>,
          </p>

          <p style="color:#333333;font-size:16px;line-height:1.8;">
            We would like to inform you that the status of your order has been updated.
          </p>

          <div style="background:#f8f9fc;border-left:4px solid #001f54;padding:20px;margin:25px 0;">

            <p style="margin:0 0 12px 0;color:#333333;font-size:15px;">
              <strong>Order ID:</strong> ${finalData._id}
            </p>

            <p style="margin:0 0 12px 0;color:#333333;font-size:15px;">
              <strong>Previous Status:</strong> ${finalData.oldStatus}
            </p>

            <p style="margin:0 0 12px 0;color:#333333;font-size:15px;">
              <strong>Current Status:</strong>
              <span style="color:#001f54;font-weight:bold;">
                ${finalData.orderStatus}
              </span>
            </p>

            <p style="margin:0;color:#333333;font-size:15px;">
              <strong>Total Amount:</strong> ₹${finalData.total}
            </p>

          </div>

          <p style="color:#333333;font-size:16px;line-height:1.8;">
            Please keep this email for your records. You can track the progress of your order from your account dashboard.
          </p>

          <div style="text-align:center;margin:35px 0;">
            <a
              href="${process.env.SITE_URL}"
              style="
                display:inline-block;
                background:#001f54;
                color:#ffffff;
                text-decoration:none;
                padding:14px 32px;
                border-radius:6px;
                font-size:16px;
                font-weight:bold;
              "
            >
              View My Orders
            </a>
          </div>

          <div style="background:#f8f9fc;border-left:4px solid #001f54;padding:15px;margin-top:25px;">
            <p style="margin:0;color:#555555;font-size:14px;line-height:1.6;">
              If you have any questions regarding your order, feel free to contact our support team.
            </p>
          </div>

          <p style="margin-top:30px;color:#333333;font-size:16px;">
            Thank you for shopping with us.
          </p>

          <p style="margin-top:20px;color:#333333;font-size:16px;">
            Regards,<br>
            <strong>${process.env.SITE_NAME} Team</strong>
          </p>

        </div>

        <div style="background:#001f54;padding:15px;text-align:center;">
          <p style="margin:0;color:#ffffff;font-size:13px;">
            © ${new Date().getFullYear()} ${process.env.SITE_NAME}. All Rights Reserved.
          </p>
        </div>
          </div>
        </div>

                `,
        },

        (error, info) => {
          if (error) {
            console.log("❌ Mail Sending Failed");
            console.log(error.message);
          } else {
            console.log("✅ Mail Sent Successfully");
            console.log(info.response);
          }
        },
      );
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
    let data = await Checkout.findOne({ _id: req.params._id });
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
  getUserRecord: getUserRecord,
  order: order,
  verifyOrder: verifyOrder,
};
