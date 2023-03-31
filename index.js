const express = require("express");
const multer = require("multer"); // module for uploading files
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // module for parse request body
//
const { registrValid, loginValid } = require("./validations/auth");
const chechAuth = require("./utils/checkAuth");
const { registr, login, userInfo } = require("./controllers/userController");
const postValid = require("./validations/post");
const {
  cratePost,
  getAllPosts,
  getPost,
  deletePost,
  updatePost,
} = require("./controllers/postController");
//
//
const app = express(); // create express application
//
//
// Add middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//
//
//============================== start multer settings (upload module) ===============================================
const storage = multer.diskStorage({
  //create storage for uploading files (folder => uploads)
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    //
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // can use it to create unique random name
    // cb(null, file.fieldname + "-" + uniqueSuffix); // can use it to create unique random name

    cb(null, file.originalname); // upload file and create it with his name
  },
});
const upload = multer({ storage });
//============================== end multer settings ===============================================
//
//
//  ==============================start uploads multer controllers ========================================
app.post("/upload", upload.single("image"), (req, res) => {
  // Everything went fine.
  // if uploading was success ==>
  res.json({
    url: `file size -> ${Math.round(
      +req.file.size / 1000
    )} kbit, uploads to the ${req.file.path} directory`, //return message to user with path of uploaded image and it size (kbit)
  });
});
app.use("/uploads", express.static("uploads")); // to open images from folder "uploads" by image's path in the browser
//  ==============================start uploads multer controllers ========================================
//
//
//============================== start mongo settings ===============================================
const PASS_MONGO_DB = ""; // mongodb pass for claster
mongoose
  .connect(
    `mongodb+srv://hryvaihor422:${PASS_MONGO_DB}@cluster0.os60ogr.mongodb.net/test?retryWrites=true&w=majority`
  )
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => {
    console.log(err);
  });
//============================== end mongo settings ===============================================
//
//
//  ==============================start user controllers ===============================================
// registr user
app.post("/auth/register", registrValid, registr);
// login user
app.post("/auth/login", loginValid, login);
// get user info
app.get("/auth/me", chechAuth, userInfo);
//  ==============================end user controllers ===============================================
//
//
//
//  ==============================start post controllers ===============================================
// create post
app.post("/posts", chechAuth, postValid, cratePost);
// gat all posts
app.get("/posts", getAllPosts);
// get post
app.get("/posts/:id", getPost);
// update post
app.patch("/posts/:id", chechAuth, postValid, updatePost);
// remove post
app.delete("/posts/:id", chechAuth, deletePost);
//  ==============================end post controllers ===============================================
//
//
//
app.use(express.json()); // now we can read request.body  from POST request
//
//
app.get("/", (req, res) => {
  res.send("yooo");
});
//
//
app.listen(3000, (err) => {
  if (err) {
    // if our server didn't start
    return console.log(err);
  }
  console.log("server has been started on http://localhost:3000/");
});
