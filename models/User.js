const { Schema, model } = require("mongoose");

const profilePictureSchema = new Schema({
  publicId: { type: String, default: "" },
  secureUrl: { type: String, default: "" },
});

const UserSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      min: 6,
    },

    profilePicture: { type: profilePictureSchema },

    coverPicture: { type: profilePictureSchema },

    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    followings: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isAdmin: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
  },
  { timestamps: true }
);

const User = model("User", UserSchema);
module.exports = User;
