const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 4000;

//cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());

//route import
const user = require("./routes/user");
app.use("/api/v1", user);

//activate
app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});

const dbConnect = require("./config/database");
dbConnect();

//default Route
app.get("/", (req, res) => {
  res.send(`<h1> This is HOMEPAGE baby</h1>`);
});
