'use strict';
var bcrypt = require('bcrypt');
var md5 = require('md5');
var nodeMailer = require('nodemailer');
var emailContent = require('./emailContent');
var sub= '',
body = '';

let bodyHeader = emailContent.emailHeader;
let bodyFooter = emailContent.emailFooter;

module.exports.email = (ramdomNumber, user) => { 
	console.log (ramdomNumber)
   console.log (user)
   console.log('NOde Mailer');
   
    let transporter = nodeMailer.createTransport({
      service: 'Gmail',
      auth: {
          user: 'test.chapter247@gmail.com',
          pass: 'chapter247@@'
      }
   });

   let bodyData = '<tr> <td style="color: #337ab7; font-size: 20px; font-weight: bold; padding: 15px 0 15px; text-align: center;">Forgot Password</td> </tr> <tr> <td style="padding: 0px 0 15px; text-align: center;" align="center">Hello, '+ user.adm +'</td> </tr> <tr> <td style="padding: 0px 0 15px; text-align: center;" align="center"><table style="font-family: arial,sans-serif; padding: 40px 0px;" border="0" width="100%"><tbody><tr><td><table style="font-size: 15px; padding-left: 15px; padding-right: 15px; color: #373d3f; font-family: arial,sans-serif; box-sizing: border-box;" width="100%"><tbody><tr><td style="padding: 0px 0 15px; " align="center">Click on the link below, and you’ll be redirected to a secure site to set a new password.</td></tr><tr><td style="padding: 0px 0 15px; " align="center"><a href='+ " http://localhost:4200/user?"+ramdomNumber+'>Click to reset your password</a></td></tr></tbody></table></td></tr></tbody></table></td> </tr> ';
   body = bodyHeader.concat(bodyData,bodyFooter);

   var mailOptions = {
      from: '"T LifeCycle" <test.chapter247@gmail.com>', // sender address
      to: 'yash.chapter247@gmail.com',// list of receivers
      subject: 'Email Verification for T LifeCycle', // Subject line
      html:body
    };
   
   transporter.sendMail(mailOptions, function(error, info){
      if(error)
      {
         return console.log(error);
      }
      else
      { 
         console.log('Message %s sent: %s', info.messageId, info.response);
      }      
   }); 
}