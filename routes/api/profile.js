const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
// Middleware
const auth = require("../../middleware/auth");

// Models
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route      GET api/profile/me
// @desc       Get current users profile
// @access     Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name", "avatar"]);

    // If no profile
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    // If is profile
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route      POST api/profile
// @desc       Create or update user profile
// @access     Private

router.post(
  "/",
  [auth,[
      check("status", "Status is required")
        .not()
        .isEmpty(),
      check("skills", "Skills is required")
        .not()
        .isEmpty()
    ]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // const {
    //   company,
    //   location,
    //   website,
    //   bio,
    //   skills,
    //   status,
    //   githubusername,
    //   youtube,
    //   twitter,
    //   instagram,
    //   linkedin,
    //   facebook
    // } = req.body;

    // // Build profile object
    // const profileFeilds = {};
    // profileFields.user = req.user.id;
    // if (company) profileFeilds.company = company;
    // if (website) profileFeilds.website = website;
    // if (location) profileFeilds.location = location;
    // if (bio) profileFeilds.bio = bio;
    // if (status) profileFeilds.status = status;
    // if (githubusername) profileFeilds.githubusername = githubusername;
    // if (skills) {
    //   profileFeilds.skills = skills.split(",").map(skill => skill.trim());
    // }
    // console.log(skills);
    // res.send("Hello");
  }
);

module.exports = router;
