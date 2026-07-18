require("dotenv").config();
const jwt = require("jsonwebtoken");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InJvbGUiOiJQdWJsaWMifSwiaWF0IjoxNzgyOTIwMjA0LCJleHAiOjIwOTg0OTYyMDR9.8lq-BlRDKMuM3xpxvyNITbk42DaPFZjVsKdfLjz2fwY";

try {
  const data = jwt.verify(token, process.env.JWT_SECRET_KEY_PUBLIC);
  console.log("Verified");
  console.log(data);
} catch (err) {
  console.log(err.message);
}
