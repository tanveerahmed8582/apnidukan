const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

require("./db-connect");

const Router = require("./routes");
// var corsOptions = {
//   origin: "http://localhost:5173",
//   optionsSuccessStatus: 200,
// };

const app = express();
//app.use(cors(corsOptions));
app.use(cors());

app.use(express.json());

app.use("/public", express.static("./public"));

app.use(express.static(path.join(__dirname, "dist")));

app.use("/api", Router);

app.use((req, res) => {
  express.static(path.join(__dirname, "dist"));
});

let port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is Running at http://localhost:${port}`);
});
