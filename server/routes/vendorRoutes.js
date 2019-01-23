const express = require('express');
const vendorRouter = express.Router();

const ctrlVendor= require ('../controllers/vendorController')

var multer = require("multer");

//VENDOR
vendorRouter.post('/register',ctrlVendor.vendorRegister);
vendorRouter.post('/authenticate', ctrlVendor.vendorAuthenticate);
vendorRouter.post('/social-authenticate', ctrlVendor.vendorSocialAuthenticate);
vendorRouter.get('/profile/:id', ctrlVendor.vendorProfile);

vendorRouter.post('/circuit/remove', ctrlVendor.vendorCircuitDelete)


module.exports = vendorRouter;