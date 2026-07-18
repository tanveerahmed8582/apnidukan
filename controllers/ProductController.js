const Product = require("../models/Product");
const Newsletter = require("../models/Newsletter");
const mailer = require("../mailer/index");
const fs = require("fs");

async function createRecord(req, res) {
  try {
    let data = new Product(req.body);
    if (req.files) {
      data.pic = Array.from(req.files).map((x) => x.path);
    }
    await data.save();
    let finalData = await Product.findOne({ _id: data._id })
      .populate("maincategory", ["name"])
      .populate("subcategory", ["name"])
      .populate("brand", ["name"]);
    res.send({
      result: "Done",
      data: finalData,
    });

    let newsletter = await Newsletter.find();
    newsletter.forEach((item) => {
      mailer.sendMail({
        from: process.env.MAILER,
        to: item.email,
        subject: `Introducing Our New Product | ${process.env.SITE_NAME}`,
        html: `
                  <div style="margin:0;padding:20px;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">

          <div style="max-width:600px;margin:auto;background:#ffffff;border:1px solid #e5e7eb;    border-radius:8px;overflow:hidden;">
              <div style="background:#001f54;padding:30px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:30px;">
                  ${process.env.SITE_NAME}
                </h1>
              </div>

          <div style="padding:35px;">

              <h2 style="margin-top:0;color:#001f54;">
                🎉 New Product Just Arrived
              </h2>

              <p style="color:#333333;font-size:16px;line-height:1.8;">
                Hello,
              </p>

              <p style="color:#333333;font-size:16px;line-height:1.8;">
                We're excited to introduce a brand-new product now available at
                <strong>${process.env.SITE_NAME}</strong>.
              </p>

              <div style="background:#f8f9fc;border-left:4px solid #001f54;padding:20px;margin:25px 0;">

                <p style="margin:0 0 12px 0;color:#333333;font-size:16px;">
                  <strong>Product Name:</strong> ${finalData.name}
                </p>

                <p style="margin:0 0 12px 0;color:#333333;font-size:16px;">
                  <strong>Brand:</strong> ${finalData.brand?.name}
                </p>

                <p style="margin:0;color:#333333;font-size:16px;">
                  <strong>Price:</strong> ₹${finalData.finalPrice}
                </p>

              </div>

                <p style="color:#333333;font-size:16px;line-height:1.8;">
                  This product has been carefully selected to provide quality, value, and an excellent shopping experience.
                </p>

                <div style="text-align:center;margin:35px 0;">
                  <a
                    href="${process.env.SITE_URL}/product/${finalData._id}"
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
                    View Product
                  </a>
                </div>

              <div style="background:#f8f9fc;border-left:4px solid #001f54;padding:15px;margin-top:25px;">
                  <p style="margin:0;color:#555555;font-size:14px;line-height:1.6;">
                    Be among the first to explore this latest addition and enjoy exclusive shopping opportunities.
                  </p>
              </div>

              <p style="margin-top:30px;color:#333333;font-size:16px;">
                Happy Shopping!
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
      });
    });
  } catch (error) {
    console.log(error);
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (error) {}
    }

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
    let data = await Product.find()
      .populate("maincategory", ["name", "pic"])
      .populate("subcategory", ["name", "pic"])
      .populate("brand", ["name", "pic"])
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
    let data = await Product.findOne({ _id: req.params._id })
      .populate("maincategory", ["name", "pic"])
      .populate("subcategory", ["name", "pic"])
      .populate("brand", ["name", "pic"]);
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

// async function updateRecord(req, res) {
//   try {
//     let data = await Product.findOne({ _id: req.params._id });
//     if (data) {
//       data.name = req.body.name ?? data.name;
//       data.maincategory = req.body.maincategory ?? data.maincategory;
//       data.subcategory = req.body.subcategory ?? data.subcategory;
//       data.brand = req.body.brand ?? data.brand;
//       data.color = req.body.color ?? data.color;
//       data.size = req.body.size ?? data.size;
//       data.basePrice = req.body.basePrice ?? data.basePrice;
//       data.discount = req.body.discount ?? data.discount;
//       data.finalPrice = req.body.finalPrice ?? data.finalPrice;
//       data.stock = req.body.stock ?? data.stock;
//       data.stockQuantity = req.body.stockQuantity ?? data.stockQuantity;
//       data.description = req.body.description ?? data.description;
//       data.status = req.body.status ?? data.status;

//       await data.save();

//       if (req.files?.length) {
//         data.pic.forEach((x, index) => {
//           if (!req.body.oldPics?.includes(x)) {
//             try {
//               fs.unlinkSync(x);
//             } catch (error) {}
//             data.pic.splice(index, 1);
//           }
//         });
//         data.pic = data.pic.concat(Array.from(req.files).map((x) => x.path));
//         await data.save();
//       }
//       let finalData = await Product.findOne({ _id: data._id })
//         .populate("maincategory", ["name"])
//         .populate("subcategory", ["name"])
//         .populate("brand", ["name"]);
//       res.send({
//         result: "Done",
//         data: finalData,
//       });
//     } else {
//       res.status(404).send({
//         result: "Fail",
//         reason: "Record Not Found",
//       });
//     }
//   } catch (error) {
//     if (req.files) {
//       Array.from(req.files).forEach((file) => {
//         try {
//           fs.unlinkSync(file.path);
//         } catch (error) {}
//       });
//     }
//     let errorMessage = Object.fromEntries(
//       Object.keys(error?.errors).map((key) => [key, error.errors[key].message]),
//     );
//     res.status(Object.values(errorMessage).length ? 400 : 500).send({
//       result: "Fail",
//       reason: Object.values(errorMessage).length
//         ? errorMessage
//         : "Internal Server Error",
//     });
//   }
// }

async function updateRecord(req, res) {
  try {
    let data = await Product.findOne({ _id: req.params._id });

    if (data) {
      if (req.body.option) {
        data.stock = req.body.stock ?? data.stock;
        data.stockQuantity = req.body.stockQuantity ?? data.stockQuantity;
        await data.save();
      } else {
        data.name = req.body.name ?? data.name;
        data.maincategory = req.body.maincategory ?? data.maincategory;
        data.subcategory = req.body.subcategory ?? data.subcategory;
        data.brand = req.body.brand ?? data.brand;
        data.color = req.body.color ?? data.color;
        data.size = req.body.size ?? data.size;
        data.basePrice = req.body.basePrice ?? data.basePrice;
        data.discount = req.body.discount ?? data.discount;
        data.finalPrice = req.body.finalPrice ?? data.finalPrice;
        data.stock = req.body.stock ?? data.stock;
        data.stockQuantity = req.body.stockQuantity ?? data.stockQuantity;
        data.description = req.body.description ?? data.description;
        data.status = req.body.status ?? data.status;

        await data.save();

        if ((await data.save()) && req.files) {
          data.pic.forEach((x) => {
            if (!req.body.oldPics?.includes(x)) {
              fs.unlink(x, (error) => {});
            }
          });
          if (typeof req.body.oldPics == "undefined")
            data.pic = Array.from(req.files).map((x) => x.path);
          else
            data.pic = req.body.oldPics?.concat(
              Array.from(req.files).map((x) => x.path),
            );
          await data.save();
        }
      }
      // data.name = req.body.name ?? data.name;
      // data.maincategory = req.body.maincategory ?? data.maincategory;
      // data.subcategory = req.body.subcategory ?? data.subcategory;
      // data.brand = req.body.brand ?? data.brand;
      // data.color = req.body.color ?? data.color;
      // data.size = req.body.size ?? data.size;
      // data.basePrice = req.body.basePrice ?? data.basePrice;
      // data.discount = req.body.discount ?? data.discount;
      // data.finalPrice = req.body.finalPrice ?? data.finalPrice;
      // data.stock = req.body.stock ?? data.stock;
      // data.stockQuantity = req.body.stockQuantity ?? data.stockQuantity;
      // data.description = req.body.description ?? data.description;
      // data.status = req.body.status ?? data.status;

      // // oldPics ko array bana do
      // let oldPics = [];

      // if (req.body.oldPics) {
      //   oldPics = Array.isArray(req.body.oldPics)
      //     ? req.body.oldPics
      //     : [req.body.oldPics];
      // }

      // // Jo old pics remove ki gayi hain unhe delete karo
      // data.pic = data.pic.filter((pic) => {
      //   if (oldPics.includes(pic)) return true;

      //   try {
      //     fs.unlinkSync(pic);
      //   } catch (err) {}

      //   return false;
      // });

      // // New pics add karo
      // if (req.files?.length) {
      //   data.pic.push(...req.files.map((file) => file.path));
      // }

      // await data.save();

      let finalData = await Product.findOne({ _id: data._id })
        .populate("maincategory", ["name"])
        .populate("subcategory", ["name"])
        .populate("brand", ["name"]);

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
    console.log(error);

    if (req.files?.length) {
      req.files.forEach((file) => {
        try {
          fs.unlinkSync(file.path);
        } catch (err) {}
      });
    }

    let errorMessage = error?.errors
      ? Object.fromEntries(
          Object.keys(error.errors).map((key) => [
            key,
            error.errors[key].message,
          ]),
        )
      : {};

    res.status(Object.keys(errorMessage).length ? 400 : 500).send({
      result: "Fail",
      reason: Object.keys(errorMessage).length
        ? errorMessage
        : "Internal Server Error",
    });
  }
}

async function deleteRecord(req, res) {
  try {
    let data = await Product.findOne({ _id: req.params._id });
    if (data) {
      data.pic.forEach((file) => {
        try {
          fs.unlinkSync(file);
        } catch (error) {}
      });
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

// const fs = require("fs");

// const Product = require("../models/Product");
// const Newsletter = require("../models/Newsletter");
// const mailer = require("../mailer/index");

// async function createRecord(req, res) {
//   try {
//     let data = new Product(req.body);
//     if (req.files) {
//       data.pic = Array.from(req.files).map((x) => x.path);
//     }
//     await data.save();

//     let finalData = await Product.findOne({ _id: data._id })
//       .populate("maincategory", ["name", "pic"])
//       .populate("subcategory", ["name", "pic"])
//       .populate("brand", ["name", "pic"]);
//     res.send({
//       result: "Done",
//       data: finalData,
//     });

//     let newsletter = await Newsletter.find();
//     newsletter.forEach((item) => {
//       mailer.sendMail(
//         {
//           from: process.env.MAILER,
//           to: item.email,
//           subject: `Exciting New Arrival Just for You : Team ${process.env.SITE_NAME}`,
//           html: `
//                     <tr>
//                     <td style="background-color:#0b3d91; padding:20px; text-align:center;">
//                         <h1 style="color:#ffffff; margin:0; font-size:24px;">${process.env.SITE_NAME}</h1>
//                     </td>
//                     </tr>

//                    <tr>
//                         <td style="padding:30px; color:#333333;">
//                             <h2 style="color:#0b3d91; margin-top:0;">We’ve Launched Something New!</h2>

//                             <p style="font-size:16px; line-height:24px; margin:15px 0;">
//                             Dear Customer,
//                             </p>

//                             <p style="font-size:16px; line-height:24px; margin:15px 0;">
//                             We are excited to introduce our latest product – designed with premium quality, modern style, and unbeatable comfort.
//                             </p>

//                             <p style="font-size:16px; line-height:24px; margin:15px 0;">
//                             Be among the first to explore this new arrival and upgrade your wardrobe with something truly special. Limited stock available!
//                             </p>

//                             <div style="text-align:center; margin:30px 0;">
//                             <a href="${process.env.SITE_URL}/product/${data._id}" style="display:inline-block; padding:12px 25px; background-color:#0b3d91; color:#ffffff; text-decoration:none; font-size:16px; border-radius:4px;">
//                                 Shop Now
//                             </a>
//                             </div>

//                             <p style="font-size:15px; line-height:22px; color:#555555;">
//                             Thank you for being a valued customer of ${process.env.SITE_NAME}. Stay tuned for more exciting updates and exclusive offers.
//                             </p>

//                             <p style="font-size:16px; margin-top:30px;">
//                             Warm Regards,<br>
//                             <strong style="color:#0b3d91;">Team ${process.env.SITE_NAME}</strong>
//                             </p>
//                         </td>
//                     </tr>

//                     <tr>
//                     <td style="background-color:#0b3d91; padding:15px; text-align:center;">
//                         <p style="color:#ffffff; font-size:12px; margin:0;">
//                         © 2026 ${process.env.SITE_NAME}. All Rights Reserved.
//                         </p>
//                     </td>
//                     </tr>
//                                                         `,
//         },
//         (error) => {
//           if (error) console.log(error);
//         },
//       );
//     });
//   } catch (error) {
//     console.log(error);
//     if (req.file) {
//       try {
//         fs.unlinkSync(req.file.path);
//       } catch (error) {}
//     }
//     let errorMessage = Object.fromEntries(
//       Object.keys(error?.errors).map((key) => [key, error.errors[key].message]),
//     );
//     res.status(Object.values(errorMessage).length ? 400 : 500).send({
//       result: "Fail",
//       reason: Object.values(errorMessage).length
//         ? errorMessage
//         : "Internal Server Error",
//     });
//   }
// }

// async function getRecord(req, res) {
//   try {
//     let data = await Product.find()
//       .populate("maincategory", ["name", "pic"])
//       .populate("subcategory", ["name", "pic"])
//       .populate("brand", ["name", "pic"])
//       .sort({ _id: -1 });
//     res.send({
//       result: "Done",
//       count: data.length,
//       data: data,
//     });
//   } catch (error) {
//     res.send({
//       result: "Fail",
//       reason: "Internal Server Error",
//     });
//   }
// }

// async function getSingleRecord(req, res) {
//   try {
//     let data = await Product.findOne({ _id: req.params._id })
//       .populate("maincategory", ["name", "pic"])
//       .populate("subcategory", ["name", "pic"])
//       .populate("brand", ["name", "pic"]);
//     if (data) {
//       res.send({
//         result: "Done",
//         data: data,
//       });
//     } else {
//       res.status(404).send({
//         result: "Fail",
//         reason: "Record Not Found",
//       });
//     }
//   } catch (error) {
//     res.status(500).send({
//       result: "Fail",
//       reason: "Internal Server Error",
//     });
//   }
// }

// async function updateRecord(req, res) {
//   try {
//     let data = await Product.findOne({ _id: req.params._id });
//     if (data) {
//       if (req.body.option) {
//         data.stock = req.body.stock ?? data.stock;
//         data.stockQuantity = req.body.stockQuantity ?? data.stockQuantity;
//         await data.save();
//       } else {
//         data.name = req.body.name ?? data.name;
//         data.maincategory = req.body.maincategory ?? data.maincategory;
//         data.subcategory = req.body.subcategory ?? data.subcategory;
//         data.brand = req.body.brand ?? data.brand;
//         data.color = req.body.color ?? data.color;
//         data.size = req.body.size ?? data.size;
//         data.basePrice = req.body.basePrice ?? data.basePrice;
//         data.discount = req.body.discount ?? data.discount;
//         data.finalPrice = req.body.finalPrice ?? data.finalPrice;
//         data.stock = req.body.stock ?? data.stock;
//         data.stockQuantity = req.body.stockQuantity ?? data.stockQuantity;
//         data.description = req.body.description ?? data.description;
//         data.status = req.body.status ?? data.status;

//         await data.save();

//         if ((await data.save()) && req.files) {
//           data.pic.forEach((x) => {
//             if (!req.body.oldPics?.includes(x)) {
//               fs.unlink(x, (error) => {});
//             }
//           });
//           if (typeof req.body.oldPics == "undefined")
//             data.pic = Array.from(req.files).map((x) => x.path);
//           else
//             data.pic = req.body.oldPics?.concat(
//               Array.from(req.files).map((x) => x.path),
//             );
//           await data.save();
//         }
//       }

//       let finalData = await Product.findOne({ _id: data._id })
//         .populate("maincategory", ["name", "pic"])
//         .populate("subcategory", ["name", "pic"])
//         .populate("brand", ["name", "pic"]);
//       res.send({
//         result: "Done",
//         data: finalData,
//       });
//     } else {
//       res.status(404).send({
//         result: "Fail",
//         reason: "Record Not Found",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     if (req.files) {
//       Array.from(req.files).forEach((file) => {
//         try {
//           fs.unlinkSync(file.path);
//         } catch (error) {}
//       });
//     }

//     let errorMessage = Object.fromEntries(
//       Object.keys(error?.errors).map((key) => [key, error.errors[key].message]),
//     );
//     res.status(Object.values(errorMessage).length ? 400 : 500).send({
//       result: "Fail",
//       reason: Object.values(errorMessage).length
//         ? errorMessage
//         : "Internal Server Error",
//     });
//   }
// }

// async function deleteRecord(req, res) {
//   try {
//     let data = await Product.findOne({ _id: req.params._id });
//     if (data) {
//       data.pic.forEach((file) => {
//         try {
//           fs.unlinkSync(file);
//         } catch (error) {}
//       });
//       await data.deleteOne();
//       res.send({
//         result: "Done",
//       });
//     } else {
//       res.status(404).send({
//         result: "Fail",
//         reason: "Record Not Found",
//       });
//     }
//   } catch (error) {
//     res.status(500).send({
//       result: "Fail",
//       reason: "Internal Server Error",
//     });
//   }
// }

// module.exports = {
//   createRecord: createRecord,
//   getRecord: getRecord,
//   getSingleRecord: getSingleRecord,
//   updateRecord: updateRecord,
//   deleteRecord: deleteRecord,
// };
