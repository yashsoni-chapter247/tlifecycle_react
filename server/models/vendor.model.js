const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var vendorSchema = new mongoose.Schema({
    fname: {
        type: String,
    },
    lname: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    password : {
        type: String,
    },
    role : {
        type: String
    },
    circuit : [
        {
            c_name : { type: String },
            c_address : { type : String },
            c_fiber : { type : String },
            c_description : { type : String }
        }
    ],
    created_at: {
        type: Date,
        default: Date.now()
    },
});

// Events
vendorSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});

vendorSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

vendorSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}

mongoose.model('Vendor', vendorSchema);