const router = require("express").Router();
const Post = require("../models/Post.js");
const User = require("../models/User.js");
const authorizeJwt = require("../middleware/auth");
const { cloudinary } = require("../config/cloudinary");
const { body, validationResult, check } = require("express-validator");

// @Route   POST api/posts/
// @Desc    Route for creating a post
// @Access  Private
router.post(
  "/",
  authorizeJwt,
  body("text").notEmpty(),
  body("media").isArray(),
  check("media.*").isDataURI(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { text, media } = req.body;

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ errors: [{ msg: "Not Found!" }] });
      }

      const newPost = {};
      let postMedia;

      newPost.user = req.user.id;
      newPost.description = text;

      if (media.length) {
        postMedia = await Promise.all(
          media.map((mediaFile) => {
            return cloudinary.uploader.upload(mediaFile, {
              upload_preset: "socio",
              folder: "/Socio/posts",
              resource_type: "auto",
            });
          })
        );

        newPost.media = postMedia.map((file) => {
          const { public_id: publicId, secure_url: secureUrl } = file;
          return {
            publicId,
            secureUrl,
          };
        });
      }

      const post = new Post(newPost);
      await post.save();
      res.status(201).json({ msg: "Post uploaded" });
    } catch (error) {
      res.status(500).json({ msg: "A problem occured" });
    }
  }
);

// @Route   PUT api/posts/:id
// @Desc    Route for updating a post
// @Access  Private
// router.put("/:id", authorizeJwt, async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (post.user === req.user.id) {
//       await post.updateOne({ $set: req.body });
//       res.status(200).json("Post updated");
//     } else {
//       res.status(403).json("You can only update your posts");
//     }
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// @Route   DELETE api/posts/:id
// @Desc    Route for deleting a post
// @Access  Private
router.delete("/:id", authorizeJwt, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post Not Found!!!" });
    }

    if (post.user.toString() === req.user.id) {
      if (post.media.length) {
        await Promise.all(
          post.media.map((mediaFile) => {
            return cloudinary.uploader.destroy(mediaFile.publicId);
          })
        );
      }
      await post.deleteOne({});
      res.status(200).json({ msg: "Post deleted" });
    } else {
      res.status(403).json({ msg: "You can only delete your posts" });
    }
  } catch (error) {
    res.status(500).json({ msg: "A problem occured" });
  }
});

// @Route   PUT api/posts/:id/like
// @Desc    Route for liking/ disliking a post
// @Access  Private
router.put("/:id/like", authorizeJwt, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.likes.some((item) => item.user.toString() === req.user.id)) {
      await post.updateOne({ $push: { likes: { user: req.user.id } } });
      res.status(201).json("Post liked");
    } else {
      await post.updateOne({ $pull: { likes: { user: req.user.id } } });
      res.status(201).json("Post disliked");
    }
  } catch (error) {
    res.status(500).json({ msg: "A problem occured" });
  }
});

// @Route   GET api/posts/:id
// @Desc    Route for getting a post by id
// @Access  Private
router.get("/:id", authorizeJwt, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "user",
      "username profilePicture"
    );
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ msg: "A problem occured" });
  }
});

// @Route   GET api/posts/timeline/all
// @Desc    Route for getting timeline posts
// @Access  Private
router.get("/timeline/all", authorizeJwt, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    const userPosts = await Post.find({ user: currentUser._id })
      .sort({ createdAt: -1 })
      .populate("user", "username profilePicture");

    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ user: friendId })
          .sort({ createdAt: -1 })
          .populate("user", "username profilePicture");
      })
    );

    let timelinePosts = userPosts.concat(...friendPosts);
    timelinePosts = timelinePosts.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    res.status(200).json({ posts: timelinePosts });
  } catch (error) {
    res.status(500).json({ msg: "A problem occured" });
  }
});

//@Route  GET api/posts/userposts/:userName
//@Desc   Route for getting user posts by userName
//@Access Private
router.get("/userposts/:userName", authorizeJwt, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.userName });
    if (!user) {
      return res.status(404).json({ msg: "No User" });
    }

    const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ msg: "A problem occured" });
  }
});

// //@Route  GET api/posts/user/posts/
// //@Desc   Route for getting authenticated user posts
// //@Access Private
// router.get("/user/posts", authorizeJwt, async (req, res) => {
//   try {
//     const posts = await Post.find({ user: req.user.id });
//     res.status(200).json({ posts });
//   } catch (error) {
//     res.status(500).json({ msg: "A problem occured" });
//   }
// });

module.exports = router;
