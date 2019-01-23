const express = require('express');
const adminRouter = express.Router();

const ctrlAdmin = require ('../controllers/adminController')

var multer = require("multer");

//ADMIN
adminRouter.post('/register',ctrlAdmin.adminRegister);
adminRouter.post('/authenticate', ctrlAdmin.adminAuthenticate);
adminRouter.post('/forgot-password', ctrlAdmin.adminForgotPassword);
adminRouter.post('/reset-password', ctrlAdmin.resetPassword);
adminRouter.get('/profile', ctrlAdmin.adminProfile);

module.exports = adminRouter;