const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

// @Route   POST api/auth/register
// @Desc    Route for signing up a user
// @Access  Public
router.post(
  "/register",
  body("email").isEmail(),
  body("username").notEmpty(),
  body("fullname").notEmpty(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const existingUser = await User.findOne({ email: req.body.email });

      if (existingUser) {
        return res.status(400).json({ msg: "Email already exists!" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const newUser = new User({
        username: req.body.username,
        fullname: req.body.fullname,
        email: req.body.email,
        password: hashedPassword,
      });

      const user = await newUser.save();

      res.status(201).json({ msg: "Registration complete!" });
    } catch (error) {
      res.status(500).json({ msg: "Please try again" });
    }
  }
);

// @Route   POST /api/auth/login
// @Desc    Route for signing in a user
// @Access  Public
router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(403).json({ errors: errors.array() });
    }
    try {
      const user = await User.findOne({ email: req.body.email });
      !user && res.status(404).json({ msg: "Invalid username or password" });

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      !validPassword &&
        res.status(400).json({ msg: "Invalid username or password" });

      const payload = {
        id: user._id,
        admin: user.isAdmin,
      };

      const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: process.env.EXPIRES_IN,
        issuer: process.env.ISSUER,
        audience: process.env.AUDIENCE,
      });

      return res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ msg: "Please try again" });
    }
  }
);

module.exports = router;
