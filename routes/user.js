const express = require("express");
const router = express.Router();
const user = require("../models/userModel");

const { login, signup } = require("../controllers/auth");
const { auth, isStudent, isAdmin } = require("../middlewear/auth");

router.post("/login", login);
router.post("/signup", signup);

//Protected Route

//single middlewear
router.get("/test", auth, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to protected route for test",
  });
});

//2 middlewears
router.get("/student", auth, isStudent, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to protected route for students",
  });
});

router.get("/admin", auth, isAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to protected route for admin",
  });
});

router.get("/getEmail", auth, async (req, res) => {
  try {
    const id = req.user.id;
    console.log("ID:", id);
    const user = await User.findById(id);

    res.status(200).json({
      success: true,
      user: user,
      message: "Welcome to the email route",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Fatt gya code",
    });
  }
});

module.exports = router;
