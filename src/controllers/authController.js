const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const signToken = require('../utils/signToken');
const crypto = require('crypto');

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
};

exports.forgotPassword = async(req, res, next) => {
    try {
        const { email } = req.body;
        if(!email) 
            return next(new AppError('please enter email', 401));

        const user = await User.findOne({email});
        if(!user) return next(new AppError('user not found', 404));

        const resetToken = user.createResetToken();
        await user.save({validateBeforeSave: false});
        const resetURL = `http://localhost:${process.env.PORT}/api/auth/resetPassword/${resetToken}`;

        res.status(200).json({
            status: 'success',
            resetURL: resetURL
        });
    }
    catch(err){
        next(err);
    }
};

exports.resetPassword = async(req, res, next) => {
    try{
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });
        if(!user) return next(new AppError('Invalid or expired token', 403));
        user.password = req.body.password;
        passwordResetToken = undefined;
        user.passwordResetExpires = undefined; 
        await user.save();

        res.status(200).json({
            status: 'Password changed successfully'
        });
    }
    catch(err){
        next(err);
    }
}