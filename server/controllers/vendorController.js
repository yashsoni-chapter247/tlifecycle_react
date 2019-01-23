const mongoose = require("mongoose");
var ObjectId = require("mongoose").Types.ObjectId;
const passport = require('passport');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
var config = require ('../config_files/appconfig');
const { check, validationResult } = require('express-validator/check');

const commonValidation = require('../common/validation');

const Vendor = mongoose.model('Vendor');

module.exports.vendorRegister = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: commonValidation.formatValidationErr(errors.mapped(), true) });
  }
  var vendor = new Vendor();
  vendor.fname = req.body.fname;
  vendor.lname = req.body.lname;
  vendor.email = req.body.email;
  vendor.password = req.body.password;
  vendor.role = 'vendor';
  vendor.circuit = req.body.circuit;
  vendor.save((err, vendor) => {
    if (!err) {
      res.send(vendor);
      //nodemail.email(vendor.name, vendor.email, vendor.password);
    } else {
      console.log(err);
      if (err.code == 11000)
        res.status(422).send(["Email Address already exist."]);
      else return next(err);
    }
  });
};

module.exports.vendorProfile = (req, res) => {
  console.log(req.params.id);
  Vendor.findOne({ _id: req.params.id }, (err, vendor) => {
    if (!vendor)
      return res
        .status(404)
        .json({ status: false, message: "vendor record not found." });
    else
      return res
        .status(200)
        .json({ status: true, vendor: vendor });
        // .json({ status: true, vendor: _.pick(vendor, ["fname","lname","email","role","circuit"]) });
  });
};

module.exports.vendorCircuitDelete = async (req,res) => {
  console.log(req.body);
  console.log(req.body._id);
   var id = req.body.circuit[1]._id;
   console.log(id);
   try {
    Vendor.update({ _id: req.body._id}, { circuit: { _id : id } }, (err,vendor) => {
        if(!vendor)
          return res.status(404).json({ status: false, message: "vendor record not found." });
        else{
          console.log('else working');
          return res.status(200).json({ status: true, vendor: vendor });
        }
   });
  }
  catch (error) {
    res.status(500).json ({
      error: error.message ? error.message : 'Unexpected error occure.'
    });
  }
}

module.exports.vendorAuthenticate = (req, res) => {
  console.log(req.body);
  try {
  Vendor.findOne({ email: req.body.email },
    (err, vendor) => {
        if (err)
            return res.status(400).json(err);
        // unknown vendor
        else if (!vendor)
            return res.status(400).json({ message: 'Email is not registered' });
        // wrong password
        else if (!vendor.verifyPassword(req.body.password))
            return res.status(400).json({ message: 'Enter correct password' });
        // authentication succeeded
        else
             return res.status(200).json({ token: vendor.generateJwt(), Vendor: vendor });
    });
  }
  catch (error) {
    res.status(500).json({
      error: error.message ? error.message : 'Unexpected error occure.'
    });
}
};

module.exports.vendorSocialAuthenticate = (req,res) => {
  console.log(req.body);
  var vendor = req.body.firstName;
  console.log(req.body.firstName);
  var token = jwt.sign({firstName:req.body.firstName,lastName:req.body.lastName}, config.secret, {
    expiresIn : 60*60*24 });  
  return res.status(200).json({token:token, "vendor":req.body });
}




