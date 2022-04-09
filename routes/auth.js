const router = require("express").Router();
const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    //    Get user input
    const { username, email, password } = req.body;

    //    Validate user inputs
    if (!(username && email && password)) {
      res.status(400).json("All input is required!");
    }

    //    Check if user already exist
    //    Validate if user exist inside db
    const oldUser = await UserModel.findOne({ email });

    if (oldUser) {
      return res.status(409).json("User email already exist. Please login!");
    }

    //    Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    //    Create user inside db
    const user = await UserModel.create({
      username,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    //    Create token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    //    Save token
    user.accessToken = accessToken;

    //    return new user
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    //    Get user input
    const { username, password } = req.body;

    //    Validate user input
    if (!(username && password)) {
      res.status(400).json("All inputs are required!");
    }
    //    Validate if user exist inside db
    const user = await UserModel.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      //    Create token
      const accessToken = jwt.sign(
        {
          userId: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2d" }
      );
      //    Save token
      user.accessToken = accessToken;

      //    User
      res.status(200).json(user);
    }
    console.log(username, password);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

module.exports = router;
