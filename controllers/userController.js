// const express = require("express");
// const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken"); //add token
// const mongoose = require("mongoose");
const UserSchema = require("../models/user"); // import userSchem
const bcrypt = require("bcrypt"); // plagin for hash paww
// const chechAuth = require("../utils/checkAuth");

//to remove passwordHash from server response
function deletePassword(obj) {
  if (obj.password) {
    delete obj.password;
  }
  return obj;
}

const registr = async (req, res) => {
  try {
    //  To hash a password:
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    //
    // send new user
    const doc = new UserSchema({
      email: req.body.email,
      fullName: req.body.fullName,
      password: hash,
      avatarUrl: req.body.avatarUrl,
    });
    //
    // mongo save user function to the DB
    const user = await doc.save();
    //
    // create token for user _id
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secretKey123", //secret key for token (random)
      {
        expiresIn: "30d", // how many days token will be alive
      }
    );
    //
    // if all are good --> return response user + token
    res.json({ ...deletePassword(user._doc), token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "can not registr",
      errorType: err.keyValue,
    });
  }
};

const login = async (req, res) => {
  try {
    // try to find user email in DB
    const user = await UserSchema.findOne({ email: req.body.email }); //find user in DB, if user true,return user data from DB

    if (!user) {
      return res.status(404).json({
        message: "invalid email",
      });
    }

    // check correct password
    const isValidPass = await bcrypt.compare(
      //decrypt password
      req.body.password,
      user._doc.password
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "invalid email or pass",
      });
    }

    // create token for user _id
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secretKey123", //secret key for token (random)
      {
        expiresIn: "30d", // how many days token will be alive
      }
    );

    // if all are good --> return logined user with token
    res.json({ ...deletePassword(user._doc), token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "can not login",
      errorType: err.keyValue,
    });
  }
};

const userInfo = async (req, res) => {
  try {
    const user = await UserSchema.findById(req.userID); //find user by ID in DB
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    res.json({ ...deletePassword(user._doc) }); //return user info in response from DB (without pass)
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "can not find user",
      errorType: err.keyValue,
    });
  }
};
module.exports = { registr, login, userInfo };
