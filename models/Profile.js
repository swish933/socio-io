const { Schema, model } = require("mongoose");

const ProfileSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  photo: {
    publicId: {
      type: String,
    },
    secureUrl: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  bio: {
    type: String,
  },
  gender: {
    type: String,
  },
  interests: {
    type: [String],
  },
  skills: {
    type: [String],
  },
  company: {
    type: String,
  },
  website: {
    type: String,
  },
  location: {
    type: String,
  },
  status: {
    type: String,
  },
  gender: {
    type: String,
  },
  social: {
    facebook: {
      type: String,
    },
    twitter: {
      type: String,
    },
    instagram: {
      type: String,
    },
    linkedIn: {
      type: String,
    },
    whatsApp: {
      type: String,
    },
  },
  following: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      photo: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  followers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      photo: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Profile = model("Profile", ProfileSchema);
module.exports = Profile;
