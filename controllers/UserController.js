const jwt = require("jsonwebtoken");

const User = require("../models/User");
const passwordValidator = require("password-validator");
const bcrypt = require("bcrypt");
const mailer = require("../mailer/index");

var schema = new passwordValidator();

// Add properties to it
schema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase(1) // Must have at least 1 uppercase letter
  .has()
  .lowercase(1) // Must have at least 1 lowercase letter
  .has()
  .digits(1) // Must have at least 1 digits
  .has()
  .symbols(1) //Must have at least 1 special Character
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]); // Blacklist these values

async function createRecord(req, res) {
  console.log("Request Body:", req.body);
  if (req.body.password) {
    if (schema.validate(req.body.password)) {
      bcrypt.hash(req.body.password, 12, async (error, hash) => {
        if (error) {
          console.log(error);
          res.send({
            result: "Fail",
            reason: "Internal Server Error During Password Encryption",
          });
        } else {
          try {
            let data = new User(req.body);
            if (!req.body.option) data.role = "Buyer";
            data.password = hash;
            console.log("Before save");
            await data.save();
            console.log("After save");
            res.send({
              result: "Done",
              data: data,
            });

            mailer.sendMail({
              from: process.env.SITE_NAME,
              to: data.email,
              subject: `Welcome to ${process.env.SITE_NAME}`,
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
                      Welcome to ${process.env.SITE_NAME}
                    </h2>

                    <p style="color:#333333;font-size:16px;line-height:1.8;">
                      Hello <strong>${data.name}</strong>,
                    </p>

                    <p style="color:#333333;font-size:16px;line-height:1.8;">
                      Congratulations! Your account has been successfully created on
                      <strong>${process.env.SITE_NAME}</strong>.
                    </p>

                    <p style="color:#333333;font-size:16px;line-height:1.8;">
                      You can now explore our products, place orders, track purchases,
                      save your favorite items, and enjoy exclusive offers available only to registered customers.
                    </p>

                    <div style="background:#f8f9fc;border-left:4px solid #001f54;padding:15px;margin:25px 0;">
                      <p style="margin:0;color:#555555;font-size:14px;line-height:1.6;">
                        Registered Email: <strong>${data.email}</strong>
                      </p>
                    </div>

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

                    <p style="color:#333333;font-size:16px;line-height:1.8;">
                      Thank you for choosing us. We look forward to serving you.
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
      });
    } else {
      res.status(400).send({
        result: "Fail",
        reason: schema
          .validate(req.body.password, { details: true })
          .map((x) => x.message.replaceAll("string", "Password")),
      });
    }
  } else {
    res.send({
      result: "Fail",
      reason: "Password Field is Mendatory",
    });
  }
}

async function getRecord(req, res) {
  try {
    let data = await User.find().sort({ _id: -1 });
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
    let data = await User.findOne({ _id: req.params._id });
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
    let data = await User.findOne({ _id: req.params._id });
    if (data) {
      data.name = req.body.name ?? data.name;
      data.username = req.body.username ?? data.username;
      data.email = req.body.email ?? data.email;
      data.phone = req.body.phone ?? data.phone;
      data.role = req.body.role ?? data.role;
      data.address = req.body.address ?? data.address;
      data.status = req.body.status ?? data.status;
      if (req.body.password) {
        data.password = await bcrypt.hash(req.body.password, 12);
      }
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

async function deleteRecord(req, res) {
  try {
    let data = await User.findOne({ _id: req.params._id });
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

async function login(req, res) {
  try {
    let data = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }],
    });
    if (data && (await bcrypt.compare(req.body.password, data.password))) {
      jwt.sign(
        { data },
        process.env.JWT_SECRET_KEY_PRIVATE,
        // process.env.JWT_SECRET_KEY_PUBLIC,
        { expiresIn: "15 days" },
        (error, token) => {
          if (error) {
            res.status(500).send({
              result: "Fail",
              reason: "Internal Server Error",
            });
          } else {
            res.send({
              result: "Done",
              data: data,
              token: token,
            });
          }
        },
      );
    } else {
      res.status(401).send({
        result: "Fail",
        reason: "Invalid Username or Password",
      });
    }
  } catch (error) {
    res.status(500).send({
      result: "Fail",
      reason: "Internal Server Error",
    });
  }
}

async function forgetPassword1(req, res) {
  try {
    let data = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }],
    });
    if (data) {
      let otp = Math.random().toString().slice(2, 8);
      data.otpAuthObject = {
        otp: otp,
        createdAt: new Date(),
      };
      await data.save();

      res.send({
        result: "Done",
        message: "OTP has been Send On Your Registered Email Address",
      });

      mailer.sendMail(
        {
          from: process.env.MAILER,
          to: data.email,
          subject: `OTP for Password Reset : Team ${process.env.SITE_NAME}`,
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
                    Password Reset Request
                  </h2>

                  <p style="color:#333333;font-size:16px;line-height:1.8;">
                    Hello <strong>${data.name}</strong>,
                  </p>

                  <p style="color:#333333;font-size:16px;line-height:1.8;">
                    We received a request to reset the password for your account.
                    Use the OTP below to verify your identity and continue the password reset process.
                  </p>

                  <div style="text-align:center;margin:35px 0;">
                    <span style="display:inline-block;background:#001f54;color:#ffffff;font-size:32px;font-weight:bold;letter-spacing:8px;padding:18px 35px;border-radius:6px;">
                      ${otp}
                    </span>
                  </div>

                  <p style="color:#333333;font-size:16px;line-height:1.8;">
                    This OTP is valid for <strong>10 minutes</strong>.
                  </p>

                  <p style="color:#333333;font-size:16px;line-height:1.8;">
                    Please do not share this OTP with anyone. Our team will never ask for your OTP or password.
                  </p>

                  <div style="background:#f8f9fc;border-left:4px solid #001f54;padding:15px;margin-top:25px;">
                    <p style="margin:0;color:#555555;font-size:14px;line-height:1.6;">
                      If you did not request a password reset, you can safely ignore this email. Your account will remain secure.
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
        (error) => {
          if (error) console.log(error);
        },
      );
    } else {
      res.status(401).send({
        result: "Fail",
        reason: "User Not Found",
      });
    }
  } catch (error) {
    res.status(500).send({
      result: "Fail",
      reason: "Internal Server Error",
    });
  }
}

async function forgetPassword2(req, res) {
  try {
    let data = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }],
    });
    if (data) {
      if (
        data.otpAuthObject.otp === req.body.otp &&
        new Date() - new Date(data.otpAuthObject.createdAt) < 600000
      ) {
        res.send({
          result: "Done",
        });
      } else {
        res.status(400).send({
          result: "Fail",
          reason: "Invalid OTP or OTP Has Been Expired",
        });
      }
    } else {
      res.status(401).send({
        result: "Fail",
        reason: "Unauthorized Activity",
      });
    }
  } catch (error) {
    res.status(500).send({
      result: "Fail",
      reason: "Internal Server Error",
    });
  }
}

async function forgetPassword3(req, res) {
  try {
    let data = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }],
    });
    if (data) {
      if (schema.validate(req.body.password)) {
        bcrypt.hash(req.body.password, 12, async (error, hash) => {
          if (error) {
            res.status(500).send({
              result: "Fail",
              reason: "Internal Server Error During Password Encryption",
            });
          } else {
            data.password = hash;
            await data.save();
            res.send({
              result: "Done",
              data: data,
              message: "Password Has Been Reset Successfully",
            });
          }
        });
      } else {
        res.status(400).send({
          result: "Fail",
          reason: schema
            .validate(req.body.password, { details: true })
            .map((x) => x.message.replaceAll("string", "Password")),
        });
      }
    } else {
      res.status(401).send({
        result: "Fail",
        reason: "Unauthorized Activity",
      });
    }
  } catch (error) {
    res.status(500).send({
      result: "Fail",
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
  login: login,
  forgetPassword1: forgetPassword1,
  forgetPassword2: forgetPassword2,
  forgetPassword3: forgetPassword3,
};
