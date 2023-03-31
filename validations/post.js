const { body, validationResult } = require("express-validator");
const handleValidationErrors = require("../utils/handleValidationErrors");

const postValid = [
  body("title")
    .isLength({ min: 5 })
    .withMessage("Minimum 5 characters required!")
    .bail()
    .isString(),
  body("text")
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!")
    .bail()
    .isString(),
  body("tags").optional(),
  body("imgUrl").optional().isURL(),
  (req, res, next) => {
    handleValidationErrors(req, res, next);
  },
];

module.exports = postValid;
