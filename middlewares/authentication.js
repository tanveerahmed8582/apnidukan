const jwt = require("jsonwebtoken");

function authSuperAdmin(req, res, next) {
  try {
    const decode = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET_KEY_PRIVATE,
    );
    if (["Super Admin"].includes(decode.data.role)) next();
    else {
      res.status(401).send({
        result: "Fail",
        reason: "You Are Not Authorized To Access This API",
      });
    }
  } catch (error) {
    res.status(401).send({
      result: "Fail",
      reason:
        error.message === "jwt must be provided"
          ? "You are not Authorized to Access This API"
          : "Your login session has been Expired, Please login again",
    });
  }
}

function authAdmin(req, res, next) {
  try {
    const decode = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET_KEY_PRIVATE,
    );
    if (["Super Admin", "Admin"].includes(decode.data.role)) next();
    else {
      res.status(401).send({
        result: "Fail",
        reason: "You Are Not Authorized To Access This API",
      });
    }
  } catch (error) {
    res.status(401).send({
      result: "Fail",
      reason:
        error.message === "jwt must be provided"
          ? "You are not Authorized to Access This API"
          : "Your login session has been Expired, Please login again",
    });
  }
}

function authBuyer(req, res, next) {
  try {
    const decode = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET_KEY_PRIVATE,
    );
    if (["Super Admin", "Admin", "Buyer"].includes(decode.data.role)) next();
    else {
      res.status(401).send({
        result: "Fail",
        reason: "You Are Not Authorized To Access This API",
      });
    }
  } catch (error) {
    res.status(401).send({
      result: "Fail",
      reason:
        error.message === "invalid signature" ||
        error.message === "jwt must be provided"
          ? "You are not Authorized to Access This API"
          : "Your login session has been Expired, Please login again",
    });
  }
}

function authPublic(req, res, next) {
  console.log("Authorization:", req.headers.authorization);
  console.log("PUBLIC KEY:", process.env.JWT_SECRET_KEY_PUBLIC);
  try {
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET_KEY_PRIVATE);
    console.log("Verified:", data);
    next();
  } catch (err) {
    console.log("PRIVATE ERROR:", err.message);
    try {
      const d = jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET_KEY_PUBLIC,
      );
      console.log("PUBLIC VERIFIED:", data);
      next();
    } catch (err2) {
      console.log("PUBLIC ERROR:", err2.message);
      res.status(401).send({
        result: "Fail",
        reason:
          error.message === "invalid signature" ||
          error.message === "jwt must be provided"
            ? "You are not Authorized to Access This API"
            : "Your login session has been Expired, Please login again",
      });
    }
  }
}

module.exports = {
  authSuperAdmin: authSuperAdmin,
  authAdmin: authAdmin,
  authBuyer: authBuyer,
  authPublic: authPublic,
};
