require('./config_files/config');
require('./models/db');
require('./config_files/passportConfig');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var path = require('path');
const passport = require('passport');
var session = require('express-session')

const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const vendorRoutes = require('./routes/vendorRoutes');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));
app.use(express.static(path.join(__dirname, './dist/tlifecycle')))
app.use(passport.initialize());
app.use(passport.session());

app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/vendor', vendorRoutes);

app.use(session({
  secret: 'superadmin',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, maxAge: 180 * 60 * 1000 },
}));

app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    else{
        console.log(err);
    }
});

app.get('*', (req, res) => {
    res.send(path.join(__dirname, './dist/tlifecycle/index.html'));
})

// start server
port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started at port : ${port}`));