const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const authenticateJwt = require("../middleware/auth");
const { cloudinary } = require("../config/cloudinary");
const { body, validationResult } = require("express-validator");

// @Route   GET api/users/
// @Desc    Route for getting currently logged in user
// @Access  Private
router.get("/", authenticateJwt, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -createdAt -updatedAt"
    );

    if (user) {
      return res.status(200).json({ user });
    }
    return res.status(404).json({ msg: "No user" });
  } catch (error) {
    res.status(500).json({ msg: "A problem occured" });
  }
});

// @Route   PUT api/users/:id
// @Desc    Route for updating a user
// @Access  Private
router.put(
  "/:id",
  body("password").isLength({ min: 6 }),
  authenticateJwt,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.user.id === req.params.id || req.user.admin) {
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (error) {
          res.status(500).json({ msg: "A problem occured" });
        }
      }

      try {
        const user = User.findByIdAndUpdate(req.params.id, { $set: req.body });
        res.status(200).json("Account updated succesfully!");
      } catch (error) {
        res.status(500).json({ msg: "A problem occured" });
      }
    } else {
      return res.status(403).json("You can only update your account");
    }
  }
);

// @Route   DELETE api/users/:userId
// @Desc    Route for deleting a user
// @Access  Private
router.delete("/:id", authenticateJwt, async (req, res) => {
  if (req.user.id === req.params.id || req.user.admin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account deleted");
    } catch (error) {
      res.status(500).json({ msg: "A problem occured" });
    }
  } else {
    return res.status(403).json("You can only delete your account");
  }
});

// @Route   GET api/users/:userName
// @Desc    Route for getting a user by userName
// @Access  Private
router.get("/:userName", authenticateJwt, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.userName }).select(
      "-password -createdAt -updatedAt"
    );
    if (!user) {
      return res.status(404).json({ msg: "No user" });
    }
    // const { password, createdAt, updatedAt, ...other } = user._doc;
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ msg: "A problem occured" });
  }
});

// @Route   PUT api/users/:userId/follow
// @Desc    Route for following a user
// @Access  Private
router.put("/:userId/follow", authenticateJwt, async (req, res) => {
  if (req.user.id !== req.params.userId) {
    try {
      const user = await User.findById(req.params.userId);
      const currentUser = await User.findById(req.user.id);
      if (!user.followers.includes(req.user.id)) {
        await user.updateOne({ $push: { followers: req.user.id } });
        await currentUser.updateOne({
          $push: { followings: req.params.userId },
        });
        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You already follow this user");
      }
    } catch (error) {
      res.status(500).json({ msg: "A problem occured" });
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
});

// @Route   PUT api/users/:userId/unfollow
// @Desc    Route for unfollowing a user
// @Access  Private
router.put("/:userId/unfollow", authenticateJwt, async (req, res) => {
  if (req.user.id !== req.params.userId) {
    try {
      const user = await User.findById(req.params.userId);
      const currentUser = await User.findById(req.user.id);
      if (user.followers.includes(req.user.id)) {
        await user.updateOne({ $pull: { followers: req.user.id } });
        await currentUser.updateOne({
          $pull: { followings: req.params.userId },
        });
        res.status(200).json("User has been unfollowed");
      } else {
        res.status(403).json("You don't follow this user");
      }
    } catch (error) {
      res.status(500).json({ msg: "A problem occured" });
    }
  } else {
    res.status(403).json("You can't unfollow yourself");
  }
});

// @Route   GET api/users/friends/:friendId
// @Desc    Route for getting user friends
// @Access  Private
router.get("/friends/:friendId", authenticateJwt, async (req, res) => {
  try {
    const user = await User.findById(req.params.friendId).select(
      "-password -createdAt -updatedAt"
    );
    if (!user) {
      throw "No such user";
    }
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendsList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendsList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendsList);
  } catch (error) {
    res.status(500).json({ msg: "A problem occured" });
  }
});

// @Route   PUT api/users/upload/profilephoto
// @Desc    Route for uploading user profile photo
// @Access  Private
router.put(
  "/upload/profilephoto",
  body("profilePicture").isDataURI(),
  authenticateJwt,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: "Enter a valid picture" });
    }
    try {
      const user = await User.findById(req.user.id);
      const { profilePicture } = req.body;

      if (user.profilePicture?.publicId) {
        await cloudinary.uploader.destroy(user.profilePicture.publicId);
      }

      const uploadResponse = await cloudinary.uploader.upload(profilePicture, {
        upload_preset: "socio",
        resource_type: "auto",
        folder: "/Socio/profilePictures",
      });

      const { public_id: publicId, secure_url: secureUrl } = uploadResponse;

      await user.updateOne({
        $set: {
          "profilePicture.publicId": publicId,
          "profilePicture.secureUrl": secureUrl,
        },
      });

      res.status(200).json({ publicId, secureUrl });
    } catch (error) {
      res.status(500).json({ msg: "A problem occured" });
    }
  }
);

// @Route   PUT api/users/delete/profilephoto/:photoId
// @Desc    Route for deleting user profile photo
// @Access  Private
router.delete(
  "/delete/profilephoto/:photoId",
  authenticateJwt,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      const publicId = req.params.photoId;

      if (user.profilePicture === undefined) {
        return res.status(403).json({ msg: "You don't have profile picture" });
      }

      if (
        user.profilePicture.publicId === `Socio/profilePictures/${publicId}`
      ) {
        await cloudinary.uploader.destroy(user.profilePicture.publicId);
        user.profilePicture.publicId = "";
        user.profilePicture.secureUrl = "";
        await user.save();
        res.status(204).json({ msg: "Deleted profile picture" });
      } else {
        res
          .status(403)
          .json({ msg: "You can only delete your own profile picture" });
      }
    } catch (error) {
      res.status(500).json({ msg: "A problem occured" });
    }
  }
);

// @Route   PUT api/users/upload/coverphoto
// @Desc    Route for uploading user cover photo
// @Access  Private

router.put(
  "/upload/coverphoto",
  body("coverPicture").isDataURI(),
  authenticateJwt,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: "Enter a valid picture" });
    }
    try {
      const user = await User.findById(req.user.id);
      const { coverPicture } = req.body;

      if (user.coverPicture?.publicId) {
        await cloudinary.uploader.destroy(user.coverPicture.publicId);
      }

      const uploadResponse = await cloudinary.uploader.upload(coverPicture, {
        upload_preset: "socio",
        resource_type: "auto",
        folder: "/Socio/coverPictures",
      });

      const { public_id: publicId, secure_url: secureUrl } = uploadResponse;

      await user.updateOne({
        $set: {
          "coverPicture.publicId": publicId,
          "coverPicture.secureUrl": secureUrl,
        },
      });

      // let pubId = publicId.split("/")[2];

      res.status(200).json({ publicId, secureUrl });
    } catch (error) {
      res.status(500).json({ msg: "A problem occured" });
    }
  }
);

// @Route   PUT api/users/delete/coverphoto/:photoId
// @Desc    Route for deleting user cover photo
// @Access  Private
router.delete(
  "/delete/coverphoto/:photoId",
  authenticateJwt,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      const publicId = req.params.photoId;

      if (user.coverPicture === undefined) {
        return res.status(403).json({ msg: "You don't have profile picture" });
      }

      if (user.coverPicture.publicId === `Socio/coverPictures/${publicId}`) {
        await cloudinary.uploader.destroy(user.coverPicture.publicId);
        user.coverPicture.publicId = "";
        user.coverPicture.secureUrl = "";
        await user.save();
        res.status(204).json({ msg: "Deleted profile picture" });
      } else {
        res
          .status(403)
          .json({ msg: "You can only delete your own profile picture" });
      }
    } catch (error) {
      res.status(500).json({ msg: "A problem occured" });
    }
  }
);

router.post("/search", authenticateJwt, async (req, res) => {
  try {
    let userPattern = new RegExp(`^${req.body.query}`, `gi`);
    const users = await User.find({
      $or: [
        { username: { $regex: userPattern } },
        { email: { $regex: userPattern } },
        { fullname: { $regex: userPattern } },
      ],
    });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ msg: "A problem occured" });
  }
});

module.exports = router;
