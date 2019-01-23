const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var adminSchema = new mongoose.Schema({
    adminname: {
        type: String,
        required: 'Adminname can\'t be empty',
        unique: true
    },
    email: {
        type: String,
        required: 'Username can\'t be empty',
        unique: true
    },
    password : {
        type: String,
        required: 'Password can\'t be empty',
    },    
    remember_token : {
        type: String,
    },
    role : {
        type: String,
    },
    
});

// Events
adminSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        console.log(this.password);
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        }); 
    });
});

adminSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

adminSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}

mongoose.model('Admin', adminSchema);