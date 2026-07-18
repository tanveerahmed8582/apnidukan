const Newsletter = require("../models/Newsletter");
const mailer = require("../mailer/index");

async function createRecord(req, res) {
  try {
    let data = new Newsletter(req.body);
    await data.save();
    res.send({
      result: "Done",
      data: data,
    });

    mailer.sendMail({
      from: process.env.MAILER,
      to: data.email,
      subject: `Newsletter Subscription Confirmed | ${process.env.SITE_NAME}`,
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
        Newsletter Subscription Confirmed
      </h2>

      <p style="color:#333333;font-size:16px;line-height:1.8;">
        Hello <strong>${data.email}</strong>,
      </p>

      <p style="color:#333333;font-size:16px;line-height:1.8;">
        Thank you for subscribing to the <strong>${process.env.SITE_NAME}</strong> newsletter.
      </p>

      <p style="color:#333333;font-size:16px;line-height:1.8;">
        You will now receive updates about:
      </p>

      <ul style="color:#333333;font-size:16px;line-height:1.8;padding-left:25px;">
        <li>New Products & Collections</li>
        <li>Special Offers & Discounts</li>
        <li>Latest Announcements</li>
        <li>Exclusive Subscriber Deals</li>
      </ul>

      
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
                  Start Shopping
                </a>
              </div>



      <div style="background:#f8f9fc;border-left:4px solid #001f54;padding:15px;margin:25px 0;">
        <p style="margin:0;color:#555555;font-size:14px;line-height:1.6;">
          You're receiving this email because you subscribed to our newsletter using this email address.
        </p>
      </div>

      <p style="color:#333333;font-size:16px;line-height:1.8;">
        We're excited to keep you updated with the latest news and offers.
      </p>

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
    });
  } catch (error) {
    let arr = [];
    if (error?.keyValue)
      arr = Object.keys(error.keyValue).map((key) => [
        key,
        `This ${key} Has Been Already Registered With Us`,
      ]);
    else console.log(error);
    arr = Object.keys(error?.errors).map((key) => [
      key,
      error.errors[key].message,
    ]);
    console.log(error);
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
    let data = await Newsletter.find().sort({ _id: -1 });
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
    let data = await Newsletter.findOne({ _id: req.params._id });
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
    let data = await Newsletter.findOne({ _id: req.params._id });
    if (data) {
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
    res.status(500).send({
      result: "Failed",
      reason: "Internal Server Error",
    });
  }
}

async function deleteRecord(req, res) {
  try {
    let data = await Newsletter.findOne({ _id: req.params._id });
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
