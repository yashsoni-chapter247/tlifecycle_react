const { body, query, check } = require('express-validator/check');

/* ------------------------------------------ Login Validation --------------------------------------- */

const loginValidation = [
  body('email').isEmail().withMessage('Email must be a valid.').trim(),
  body('password', 'Password must be at least 6 character long.').trim().isLength({ min: 6 })
];

/* ------------------------------------ forgot password validation ----------------------------------- */
const forgotPassworValidation = [
  query('email').not().isEmpty().withMessage('Please enter email address..').trim().isEmail().withMessage('Email must be a valid.').trim()
];

/* ------------------------------------ User Reset Password validation ------------------------------- */
const resetpasswordValidation = [
  body('password').not().isEmpty().withMessage('Please enter password..').trim().isLength({ min: 6 }).withMessage('Password must be 6 character long.'),
];

/* ------------------------------------ User Sign up validation -------------------------------------- */

const signupValidation = [
  body('firstName').not().isEmpty().withMessage('Please enter first name.').trim(),
  body('lastName').not().isEmpty().withMessage('Please enter last name.').trim(),
  body('contactNumber').not().isEmpty().withMessage('Please enter mobile number.').isNumeric().withMessage('Only numbers are allowed..').isLength({ min: 7, max: 14 }).withMessage('Mobile number must be 10 character long.'),
  body('email', 'Please enter email address').trim().isEmail().withMessage('Email must be a valid.'),
  body('password').not().isEmpty().withMessage('Please enter password..').trim().isLength({ min: 6 }).withMessage('Password must be 6 character long.'),
];

const updateValidation = [
  body('firstName').not().isEmpty().withMessage('Please enter first name.').trim(),
  body('lastName').not().isEmpty().withMessage('Please enter last name.').trim(),
  body('contactNumber').exists().withMessage('Mobile number is Required').not().isEmpty().withMessage('Please enter mobile number.').isNumeric().withMessage('Only numbers are allowed..').isLength({ min: 7, max: 14 }).withMessage('Mobile number must be 10 character long.'),
  body('emailAddress', 'Please enter email address').trim().isEmail().withMessage('Email must be a valid.'),
  body('password').trim().isLength({ min: 6 }).withMessage('Password must be 6 character long.'),
  check('confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password and confirm password did not match.");
    } else {
      return value;
    }
  })
];

const confirmPassword = [
  body('oldPassword').not().isEmpty().withMessage('Please enter password..').trim().isLength({ min: 6 }).withMessage('Password must be 6 character long.'),
  body('password').not().isEmpty().withMessage('Please enter password..').trim().isLength({ min: 6 }).withMessage('Password must be 6 character long.'),
  check('confirmation').not().isEmpty().withMessage('Please enter password..').trim().isLength({ min: 6 }).custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password and confirm password did not match.");
    } else {
      return value;
    }
  })
];

//Confirm Admin reset password
const confirmResetPassword = [
  body('password').not().isEmpty().withMessage('Please enter password..').trim().isLength({ min: 6 }).withMessage('Password must be 6 character long.'),
  check('confirmation').not().isEmpty().withMessage('Please enter password..').trim().isLength({ min: 6 }).custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password and confirm password did not match.");
    } else {
      return value;
    }
  })
];

/* ------------------------- Update admin profile validation ---------------------------------------- */
const updateAdminValidation = [
  body('firstName').not().isEmpty().withMessage('Please enter first name.').trim(),
  body('email', 'Please enter email address').trim().isEmail().withMessage('Email must be a valid.'),
];

/* ------------------------- Confirm Password validation -------------------------------------------- */
const confirmUserPassword = [
  body('password').trim().isLength({ min: 6 }).withMessage('Password must be 6 character long.'),
  check('confirmation').trim().isLength({ min: 6 }).withMessage('Confirm Password must be 6 character long.').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password and confirm password did not match.");
    } else {
      return value;
    }
  })
];

module.exports = {
  loginValidation,
  forgotPassworValidation,
  signupValidation,
  updateValidation,
  resetpasswordValidation,
  confirmPassword,
  updateAdminValidation,
  confirmResetPassword,
  confirmUserPassword
};