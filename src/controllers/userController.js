const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.getUsers = async(req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            result: users.length,
            data: users
        })
    }
    catch(err){
        next(err);
    }
}