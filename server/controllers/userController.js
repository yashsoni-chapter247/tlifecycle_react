const mongoose = require("mongoose");
var ObjectId = require("mongoose").Types.ObjectId;
const passport = require('passport');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
var config = require ('../config_files/appconfig');

const User = mongoose.model('User');

module.exports.userRegister = (req, res, next) => {
  console.log(req.body)
  var user = new User();
  user.fname = req.body.fname;
  user.lname = req.body.lname;
  user.email = req.body.email;
  user.password = req.body.password;
  user.role = req.body.password;
  user.save((err, user) => {
    if (!err) {
      res.send(user);
      //nodemail.email(user.name, user.email, user.password);
    } else {
      console.log(err);
      if (err.code == 11000)
        res.status(422).send(["Email Address already exist."]);
      else return next(err);
    }
  });
};

module.exports.userProfile = (req, res) => {
  console.log(req.params.id);
  User.findOne({ _id: req.params.id }, (err, user) => {
    if (!user)
      return res
        .status(404)
        .json({ status: false, message: "User record not found." });
    else
      return res
        .status(200)
        .json({ status: true, user: _.pick(user, ["fname","lname","email"]) });
  });
};

module.exports.userAuthenticate = (req, res) => {
  console.log(req.body);
  
  // call for passport authentication
  passport.authenticate("local", (err, user, info) => {
    // error from passport middleware
    if (err) return res.status(400).json(err);
    // registered user
    else if (user) return res.status(200).json({ token: user.generateJwt(), "user":user });
    // unknown user or wrong password
    else return res.status(404).json(info);
  })(req, res);
};

module.exports.userSocialAuthenticate = (req,res) => {
  console.log(req.body);
  var user = req.body.firstName;
  console.log(req.body.firstName);
  var token = jwt.sign({firstName:req.body.firstName,lastName:req.body.lastName}, config.secret, {
    expiresIn : 60*60*24 });  
  return res.status(200).json({token:token, "user":req.body });
}



