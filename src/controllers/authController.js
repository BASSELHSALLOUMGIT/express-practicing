const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const signToken = require('../utils/signToken');

exports.login = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        if(!email || !password)
            return next(new AppError('email and password are required', 401));

        const user = await User.findOne({email}).select('+password');
        if(!user || !(await user.correctPassword(password)))
            return next(new AppError('Incorrect email or password', 401));

        const token = signToken(user._id);
        res.status(200).json({
            status: 'success',
            token
        });
    }
    catch(err){
        next(err);
    }
}