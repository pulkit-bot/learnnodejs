const { body } = require("express-validator");

const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters"
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email address"
  }),
  price: Joi.number().empty('').optional().messages({
    "number.base": "Price must be a number",
  }),
  category: Joi.string().required().messages({
    "string.empty": "Please select a category",
    "any.required": "Price is required"
  }),
  gender: Joi.string().required().messages({
    "string.empty": "Please select gender",
    "any.required": "Gender is required"
  })
});

module.exports = productSchema;

// exports.productValidationRules = [
//   body("name")
//     .trim()
//     .notEmpty().withMessage("Name is required")
//     .isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),

//   body("email")
//     .trim()
//     .notEmpty().withMessage("Email is required")
//     .isEmail().withMessage("Invalid email format"),

//   body("price")
//     .notEmpty().withMessage("Price is required")
//     .isFloat({ gt: 0 }).withMessage("Price must be a number greater than 0"),

//     body("category")
//     .notEmpty().withMessage("Please select a category"),

//   body("gender")
//     .notEmpty().withMessage("Please select your gender")
// ];