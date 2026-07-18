const Contactus = require("../models/Contactus");
const mailer = require("../mailer/index");

async function createRecord(req, res) {
  try {
    let data = new Contactus(req.body);
    await data.save();
    res.send({
      result: "Done",
      data: data,
    });

    mailer.sendMail(
      {
        from: process.env.MAILER,
        to: data.email,
        subject: `We've Received Your Query | Team ${process.env.SITE_NAME}`,
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
                    We Have Received Your Message
                  </h2>

                  <p style="color:#333333;font-size:16px;line-height:1.8;">
                    Hello <strong>${data.name}</strong>,
                  </p>

                  <p style="color:#333333;font-size:16px;line-height:1.8;">
                    Thank you for contacting <strong>${process.env.SITE_NAME}</strong>.
                  </p>

                  <p style="color:#333333;font-size:16px;line-height:1.8;">
                    We have successfully received your query and our support team is reviewing it.
                  </p>

                  <div style="background:#f8f9fc;border-left:4px solid #001f54;padding:15px;margin:25px 0;">
                    <p style="margin:0;color:#555555;font-size:14px;line-height:1.8;">
                      <strong>Your Submitted Details</strong><br>
                      Name: ${data.name}<br>
                      Email: ${data.email}<br>
                      Subject: ${data.subject}
                    </p>
                  </div>

                  <p style="color:#333333;font-size:16px;line-height:1.8;">
                    Our team will get back to you as soon as possible. We appreciate your patience and look forward to assisting you.
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
                      Visit Our Website
                    </a>
                  </div>

                  <div style="background:#f8f9fc;border-left:4px solid #001f54;padding:15px;margin-top:25px;">
                    <p style="margin:0;color:#555555;font-size:14px;line-height:1.6;">
                      This is an automated confirmation email. Please do not reply directly to this message.
                    </p>
                  </div>

                  <p style="margin-top:30px;color:#333333;font-size:16px;">
                    Regards,<br>
                    <strong>${process.env.SITE_NAME} Support Team</strong>
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
          console.log("User Mail Error:", error);
        } else {
          console.log("User Mail Sent:", info.response);
        }
      },
    );

    mailer.sendMail(
      {
        from: process.env.MAILER,
        to: process.env.MAILER,
        subject: `New Contact Us Query Received | ${process.env.SITE_NAME}`,
        html: `
              <div style="margin:0;padding:20px;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">

             <div style="max-width:650px;margin:auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">

            <div style="background:#001f54;padding:25px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;">
                New Contact Us Query
              </h1>
            </div>

            <div style="padding:35px;">

              <p style="font-size:16px;color:#333333;line-height:1.8;">
                A new contact request has been submitted on
                <strong>${process.env.SITE_NAME}</strong>.
              </p>

              <div style="background:#f8f9fc;border-left:4px solid #001f54;padding:20px;margin-top:25px;">

                <p style="margin:0 0 12px 0;font-size:15px;color:#333333;">
                  <strong>Name:</strong> ${data.name}
                </p>

                <p style="margin:0 0 12px 0;font-size:15px;color:#333333;">
                  <strong>Email:</strong> ${data.email}
                </p>

                <p style="margin:0 0 12px 0;font-size:15px;color:#333333;">
                  <strong>Phone:</strong> ${data.phone}
                </p>

                <p style="margin:0 0 12px 0;font-size:15px;color:#333333;">
                  <strong>Subject:</strong> ${data.subject}
                </p>

                <p style="margin:0;font-size:15px;color:#333333;">
                  <strong>Message:</strong><br><br>
                  ${data.message}
                </p>

              </div>

              <p style="margin-top:30px;color:#333333;font-size:16px;">
                Please review and respond to the customer as soon as possible.
              </p>

              <p style="margin-top:30px;color:#333333;font-size:16px;">
                Regards,<br>
                <strong>${process.env.SITE_NAME} System</strong>
              </p>

            </div>

            <div style="background:#001f54;padding:15px;text-align:center;">
              <p style="margin:0;color:#ffffff;font-size:13px;">
                Received on ${new Date().toLocaleString()}
              </p>
            </div>

          </div>

        </div>
      `,
      },
      (error, info) => {
        if (error) {
          console.log("User Mail Error:", error);
        } else {
          console.log("User Mail Sent:", info.response);
        }
      },
    );
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

async function getRecord(req, res) {
  try {
    let data = await Contactus.find().sort({ _id: -1 });
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
    let data = await Contactus.findOne({ _id: req.params._id });
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
    let data = await Contactus.findOne({ _id: req.params._id });
    if (data) {
      data.status = req.body.status ?? data.status;
      await data.save();
      res.send({
        result: "Done",
        data: data,
      });

      mailer.sendMail(
        {
          from: process.env.SITE_NAME,
          to: data.email,
          subject: `Your Support Request Has Been Resolved | ${process.env.SITE_NAME}`,
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
            Your Query Has Been Resolved
          </h2>

          <p style="color:#333333;font-size:16px;line-height:1.8;">
            Hello <strong>${data.name}</strong>,
          </p>

          <p style="color:#333333;font-size:16px;line-height:1.8;">
            We are pleased to inform you that the query you submitted to our support team has been successfully reviewed and resolved.
          </p>

          <div style="background:#f8f9fc;border-left:4px solid #001f54;padding:15px;margin:25px 0;">
            <p style="margin:0;color:#555555;font-size:14px;line-height:1.8;">
              <strong>Query Subject:</strong> ${data.subject}
            </p>
          </div>

          <p style="color:#333333;font-size:16px;line-height:1.8;">
            We hope the information provided has addressed your concern satisfactorily.
          </p>

          <p style="color:#333333;font-size:16px;line-height:1.8;">
            If you need any further assistance or have additional questions, please feel free to contact us again. Our team will be happy to help.
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
              Visit Our Website
            </a>
          </div>

          <p style="margin-top:30px;color:#333333;font-size:16px;">
            Thank you for choosing us.
          </p>

          <p style="margin-top:20px;color:#333333;font-size:16px;">
            Regards,<br>
            <strong>${process.env.SITE_NAME} Support Team</strong>
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
            console.log("User Mail Error:", error);
          } else {
            console.log("User Mail Sent:", info.response);
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
    res.status(500).send({
      result: "Failed",
      reason: "Internal Server Error",
    });
  }
}

async function deleteRecord(req, res) {
  try {
    let data = await Contactus.findOne({ _id: req.params._id });
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
