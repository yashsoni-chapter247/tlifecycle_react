const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
var ObjectId = require('mongoose').Types.ObjectId;
const localStrategy = require('passport-local').Strategy;
const nodemail = require('../nodemailer')
var md5 = require('md5');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var config = require ('../config_files/appconfig');

const Admin = mongoose.model('Admin');

module.exports.adminRegister = (req, res, next) => {
    console.log(req.body)
    var admin = new Admin();
    admin.adminname = req.body.adminname;
    admin.email = req.body.email;
    admin.password= req.body.password;
    admin.role = "admin";
    admin.remember_token = "";
    admin.save((err, admin) => {
        if (!err){
            res.send(admin);
        }
        else {
            console.log(err)
            if (err.code == 11000)
                res.status(400).send(['Adminname already exist.']);
            else
                return next(err);
        }
    });
}

module.exports.adminAuthenticate = (req, res) => {
    console.log(req.body);
        console.log(req.body.email);
        console.log(req.body.password);
        Admin.findOne({ email: req.body.email },
            (err, admin) => {
                if (err)
                    return res.status(400).json(err);
                // unknown admin
                else if (!admin)
                    return res.status(400).json({ message: 'Email is not registered' });
                // wrong password
                else if (!admin.verifyPassword(req.body.password))
                    return res.status(400).json({ message: 'Enter correct password' });
                // authentication succeeded
                else
                     return res.status(200).json({ token: admin.generateJwt(), Admin: _.pick(admin, ["adminname","email","role"])  });
            });
}

module.exports.adminProfile = (req, res) =>{
    Admin.findOne({ _id: '5c17492e9da0d94e447fe0e1' },
        (err, admin) => {
            if (!admin)
                return res.status(400).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, admin : _.pick(admin,['adminname','email']) });
        }
    );
}

module.exports.adminForgotPassword = (req,res) => {
    console.log(req.body.email);
    Admin.findOne ({email : req.body.email},
        (err,admin) => {
            if (!admin)
            {
                return res.status(400).json({status: false, message: 'Email is not registered'})
            }
            else {
                console.log(admin);
                console.log('else working');

                var userCheck ="";
                var random_num = Math.floor(Math.random()*89999+10000);
                console.log(random_num);
                console.log(md5(random_num));
                Admin.findOneAndUpdate({email : req.body.email},{$set:{remember_token: md5(random_num)}}, (err,admin) => {
                    if(err){
                        return res.status(400).json({status: false, message: err})
                    }
                    else {
                        nodemail.email(md5(random_num),req.body);
                        return res.status(200).json({ status: true, message: 'Forget Password Link is shared on your Registered Email ID'});
                    }
                })
            }
        }
    )
}

module.exports.resetPassword = async (req,res) => {
    var data = req.body
    const email = req.body.email
    const remember_token = req.body.remember_token
    console.log(data);
    await Admin.findOne ({email: req.body.email}, (err,admin) => {
       if(err){
        return res.status(400).json({status: false, message: err})
       }
       else {    
            console.log(admin);
            var token = '';
            console.log(data.password);
            console.log(data.remember_token);
            console.log(token);
            // admin.updatedAt = new Date(Date.now()).toISOString();
            var salt = common.generateSalt(10);
            data.password = common.hashPassword(data.password, salt);
            // $data.salt = salt;
            Admin.findOneAndUpdate({remember_token:data.remember_token},{$set:{password : data.password, remember_token: token}}, (err,admin) => {
                if (err) {
                    return res.status(400).json({status: false, message: err})
                }
                else {
                    console.log(admin);
                    return res.status(200).json({ success: true, message: 'Password Updated Successfully.' });
                }
            })
        }
    })
}

// const resetPassword = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(422).json({ message: commonValidation.formatValidationErr(errors.mapped(), true) });
//     }
//     const id = req.body.id;
//     const email = req.body.email;
//     try {    
//       const $data = req.body
//       $data.updatedAt = new Date(Date.now()).toISOString();
//       var salt = common.generateSalt(6);
//       $data.salt = salt;
//       $data.password = common.hashPassword($data.password, salt);
//       const result = await User.update({
//       password: $data.password,salt: $data.salt},
//       {where: {id: id,email: email}
//         });
//       return res.status(200).json({responseCode: 200,data: result,message: "Password updated successfully"})
//     } catch (error) {
//       res.status(500).json({
//         error: error.message ? error.message : 'Unexpected error occure.'
//       });
//     }
//   }