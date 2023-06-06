//auth, isStudent, isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
  try {
    //extract JWT token
    //require body parser for below 2 methods, and 3rd method is most secure one
    // const token =req.body.token || req.cookie.token;
    console.log("cookie", req.cookies.token);
    console.log("body", req.body.token);
    console.log("header", req.header("Authorization"));

    const token =
      req.body.token ||
      req.cookies.token ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token || token === undefined) {
      return res.status(401).json({
        success: false,
        message: "Token Missing",
      });
    }

    //verify the token
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      console.log(payload);
      req.user = payload; //payload
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while verifying token",
      error: error.message,
    });
  }
};

//auth

exports.isStudent = (req, res, next) => {
  try {
    if (req.user.role !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for students",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "User role Student is not matching",
    });
  }
};

exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "User role Admin is not matching",
    });
  }
};
