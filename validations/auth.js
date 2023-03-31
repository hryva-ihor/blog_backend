const { body, validationResult } = require("express-validator");
const handleValidationErrors = require("../utils/handleValidationErrors");

const registrValid = [
  body("email").isEmail().withMessage("Invalid email address!"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Minimum 5 characters required!"),
  body("fullName")
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!")
    .bail()
    .isAlpha()
    .withMessage("Name must be alphabet letters."),
  body("avatarUrl").optional().isURL(),
  (req, res, next) => {
    handleValidationErrors(req, res, next);
  },
];
const loginValid = [
  body("email").isEmail().withMessage("Invalid email address!"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Minimum 5 characters required!"),
  (req, res, next) => {
    handleValidationErrors(req, res, next);
  },
];

module.exports = { registrValid, loginValid };
