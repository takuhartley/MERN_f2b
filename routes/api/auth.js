const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const config = require("config");
const express = require("express");
const jwt = require("jsonwebtoken");


const auth = require("../../middleware/auth");
const User = require("../../models/User");

const router = express.Router();
// @route      GET api/auth
// @desc       Test route
// @access     Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route      POST api/users
// @desc       Authenticate user and get token
// @access     Public
router.post(
  "/",
  [
    check("email", "please include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({
        email
      });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // Make sure password matches
      const isMatch = await bcrypt.compare(password, user.password);

      // NOT a password match
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      };

      // Signing token
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        // Experation
        { expiresIn: 360000 },
        // Error
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {

      // Server error
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
