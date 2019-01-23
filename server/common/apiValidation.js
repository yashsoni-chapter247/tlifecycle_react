const { body, query, check } = require("express-validator/check");

/* --------------------------------------- Login Validation ------------------------------------- */

const loginValidation = [
  body('email').isEmail().withMessage('Email must be a valid.').trim(),
  body('password', 'Password must be at least 6 character long.').trim().isLength({ min: 6 })
];

/* ----------------------------------- forgot password validation --------------------------------- */

const forgotPassworValidation = [
  query('email').not().isEmpty().withMessage('Please enter email address..').trim().isEmail().withMessage('Email must be a valid.').trim()
];

/* ---------------------------------- User Reset Password validation ------------------------------ */

const resetpasswordValidation = [
  body('password').not().isEmpty().withMessage('Please enter password..').trim().isLength({ min: 6 }).withMessage('Password must be 6 character long.'),
];

/* ------------------------------------ User Sign up validation ----------------------------------- */

const signupValidation = [
  body('fname').not().isEmpty().withMessage('Please enter first name.').trim(),
  body('lname').not().isEmpty().withMessage('Please enter last name.').trim(),
  // body('contactNumber').not().isEmpty().withMessage('Please enter mobile number.').isNumeric().withMessage('Only numbers are allowed..').isLength({ min: 7, max: 14 }).withMessage('Mobile number must be 10 character long.'),
  body('email', 'Please enter email address').trim().isEmail().withMessage('Email must be a valid.'),
  body('password').not().isEmpty().withMessage('Please enter password..').trim().isLength({ min: 6 }).withMessage('Password must be 6 character long.'),
];


module.exports = {
  loginValidation,
  forgotPassworValidation,
  resetpasswordValidation,
  signupValidation
};