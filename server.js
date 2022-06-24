const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const dotenv = require("dotenv");
const morgan = require("morgan");
const userRouter = require("./routes/users");
const postRouter = require("./routes/posts");
const authRouter = require("./routes/auth");
const path = require("path");
const cors = require("cors");

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

const app = express();
mongoose.connect(process.env.MONGO_URI, () => {
  console.log("MongoDB connected");
});

app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/auth", authRouter);

if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  //Set static folder
  app.use(express.static(path.join(__dirname, "client", "build")));
  app.use("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(process.env.PORT, () => {
  console.log("Server running...");
});
