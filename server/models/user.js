const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {JWT_KEY} = require('../utils/constants');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
       type: Number,
       required: false 
    },
    active: {
        type: Boolean,
        required: true
    },
    type: {
        type: String,
        required: true
    },

});

//generate test user and token
userSchema.methods.generateAuthToken = async() => {

    // hash the password
    let hashedPassword;
    hashedPassword = await bcrypt.hash('123456', 12);

    // user object to save in the db
    let newUser = new User({
        name: 'test_User',
        email: 'test_User@xyz.com',
        password: hashedPassword,
        role: 1,
        active: true
    });

    // save user in the db
    await newUser.save();

    const token = jwt.sign({
            userId: newUser.id,
            email: newUser.email,
        },
        JWT_KEY,
        //process.env.JWT_KEY, 
        {
            expiresIn: '1h',
        }
    );

    return {token, userId: newUser.id};
}

const User = mongoose.model('User', userSchema);

exports.User = User;

