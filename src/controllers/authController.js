const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { signAccessToken, signrefreshToken } = require('../utils/tokens');
const crypto = require('crypto');

exports.login = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        if(!email || !password)
            return next(new AppError('email and password are required', 401));

        const user = await User.findOne({email}).select('+password +refreshTokens');
        if(!user || !(await user.correctPassword(password)))
            return next(new AppError('Incorrect email or password', 401));

        const accessToken = signAccessToken(user._id);
        const refreshToken = signRefreshToken(user._id);

        user.refreshTokens.push(refreshToken);
        await user.save({ validateBeforeSave: false });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            status: 'success',
            accessToken
        });
    }
    catch(err){
        next(err);
    }
};

exports.refreshToken = async(req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if(!token) return next(new AppError('Refresh token missing', 401));

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id).select('+refreshTokens');
        if(!user || !(user.refreshTokens.includes(token)))
            return next(new AppError('forbidden', 403));

        const newAccessToken = signAccessToken(user._id);
        res.status(200).json({ accessToken: newAccessToken });
    }
    catch(err){
        next(err);
    }
};

exports.logout = async(req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if(token) {
            await User.findByIdAndUpdate(req.user.id, {
                $pull: { refreshTokens: token }
            });
        }
        res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'Strict',
        secure: process.env.NODE_ENV === 'production'
    });

    res.status(200).json({ message: 'Logged out' });
    }
    catch(err){
        
    }
}

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
};