const bcrypt = require("bcrypt");
const user = require("../models/userModel");
const jwt = require("jsonwebtoken");

require("dotenv").config();

//signup route handler
exports.signup = async (req, res) => {
  try {
    //get data
    const { name, email, password, role } = req.body;

    //check if user already exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        sucess: false,
        message: "user already exists",
      });
    }

    //if not exist then secure password
    let hashedPassword;

    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "error in hashing password",
      });
    }

    //create user
    const userSignup = await user.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(200).json({
      status: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "error in signup",
    });
  }
};

//login

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Fill Email and Password",
      });
    }

    //check user is registered or not
    let userLogin = await user.findOne({ email });

    if (!userLogin) {
      return res.status(401).json({
        success: false,
        message: "User is not registered",
      });
    }

    const payload = {
      email: userLogin.email,
      id: userLogin._id,
      role: userLogin.role,
    };
    //verify password --> hashing
    if (await bcrypt.compare(password, userLogin.password)) {
      //password matched
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      //new entry of token
      userLogin = userLogin.toObject();
      userLogin.token = token;

      //password removed (to hide from threat) from user object not from database
      userLogin.password = undefined;

      //cookie
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      //pass 3 things --> cookie name, cookie data, options
      res.cookie("mytoken", token, options).status(200).json({
        success: true,
        token,
        userLogin,
        message: "Logged in successfully",
      });
    } else {
      //password not matched
      return res.status(403).json({
        success: false,
        message: "Password not matched",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Log In failed",
    });
  }
};
