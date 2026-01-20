const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.protect = async(req, res, next) => {
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
            token = req.headers.authorization.split('')[1];

        if(!token) return next(new AppError('user in not logged in', 401));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user) return next(new AppError('user is no longer exists', 401));
        if(user.changedPasswordAfter(decoded.iat))
            return next(new AppError('password has changed recently, please log in again', 401));

        req.user = user;
        next();
    }
    catch(err){
        err.statusCode = 401;
        next(err);
    }
}