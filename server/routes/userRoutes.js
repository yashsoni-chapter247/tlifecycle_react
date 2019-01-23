const express = require('express');
const userRouter = express.Router();

const ctrlUser = require ('../controllers/userController')

var multer = require("multer");

//ADMIN
userRouter.post('/register',ctrlUser.userRegister);
userRouter.post('/authenticate', ctrlUser.userAuthenticate);
userRouter.post('/social-authenticate', ctrlUser.userSocialAuthenticate);
userRouter.get('/profile/:id', ctrlUser.userProfile);

module.exports = userRouter;