const { Schema, model } = require("mongoose");

const PostSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    media: [
      {
        publicId: {
          type: String,
        },
        secureUrl: {
          type: String,
        },
      },
    ],
    description: {
      type: String,
      max: 500,
      required: true,
    },
    likes: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const Post = model("Post", PostSchema);
module.exports = Post;
