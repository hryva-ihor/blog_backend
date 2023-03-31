const PostSchema = require("../models/post");

//=============GET ALL POSTS==========
const getAllPosts = async (req, res) => {
  try {
    //! get all posts from DB
    const posts = await PostSchema.find().populate("user").exec(); // populate use to connect user DB and posts DB
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "can not get posts",
      errorType: err.keyValue,
    });
  }
};
//=====================================

//=============GET POST==========
const getPost = async (req, res) => {
  try {
    const postID = req.params.id; // get post by id
    //we gotta use findByIdAndUpdate if we need to find and update some object in DB
    const post = await PostSchema.findByIdAndUpdate(
      {
        // findByIdAndUpdate->find and update (3 obj in attribute: 1-> what find; 2-> what update; 3-> command to return document after update)
        _id: postID,
      },
      {
        $inc: { viewsCount: 1 }, //increment post viewsCount by one every time whan we get it
      },
      {
        returnDocument: "after",
      }
    );

    // if we didn't find post
    if (!post) {
      return res.status(404).json({
        message: "can not find post",
      });
    }
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "can not get posts",
      errorType: err.keyValue,
    });
  }
};
//=====================================

//=============DELETE POST==========
const deletePost = async (req, res) => {
  try {
    const postID = req.params.id;
    const deletedPost = await PostSchema.findOneAndDelete({ _id: postID });
    if (!deletedPost) {
      return res.status(500).json({ message: "cannot find and delete post" });
    }
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "cannot delete post", errorType: err.keyValue });
  }
};
//=====================================

//=============UPDATE POST==========
const updatePost = async (req, res) => {
  try {
    const postID = req.params.id;
    const updatedPost = await PostSchema.updateOne(
      { _id: postID },
      {
        // 1-> id, 2-> what we will update
        title: req.body.title,
        text: req.body.text,
        imgUrl: req.body.imgUrl,
        tags: req.body.tags,
      }
    );
    if (!updatedPost) {
      return res.status(500).json({ message: "cannot update  post" });
    }
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "cannot update post", errorType: err.keyValue });
  }
};
//=====================================

//=============CREATE POST==========
const cratePost = async (req, res) => {
  try {
    const doc = new PostSchema({
      title: req.body.title,
      text: req.body.text,
      imgUrl: req.body.imgUrl,
      tags: req.body.tags,
      user: req.userID,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "can not create post",
      errorType: err.keyValue,
    });
  }
};
//=====================================

module.exports = { cratePost, getAllPosts, getPost, deletePost, updatePost };
