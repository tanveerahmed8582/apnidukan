require("dotenv").config();
const jwt = require("jsonwebtoken");

const token = jwt.sign(
  {
    data: {
      role: "Public",
    },
  },
  process.env.JWT_SECRET_KEY_PUBLIC,
  {
    expiresIn: "10y",
  },
);

console.log("Public Token:");
console.log(token);
