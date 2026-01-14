const User = require('../models/User');
const AppError = require('../utils/AppError');
const APIFeatures = require('../utils/APIFeatures');

exports.getUsers = async(req, res, next) => {
    try {
        const features = new APIFeatures(User.find(), req.query)
                                        .filter()
                                        .sort()
                                        .limitedFields()
                                        .paginate();

        const users = await features.query;
        res.status(200).json({
            status: 'success',
            result: users.length,
            data: users
        })
    }
    catch(err){
        next(err);
    }
};

exports.createUser = async(req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password)
            return next(new AppError('name, email and password are required', 400));

        const user = await User.create(req.body);
        res.status(201).json(user);
    }
    catch(err){
        next(err);
    }
};

exports.updateUser = async(req, res, next) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return next(new AppError('Invalid user ID', 400));

        const { name, email, password } = req.body;
        if(!name || !email || !password)
            return next(new AppError('name, email and password are required', 400));

        const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if(!user) return next(new AppError('user not found', 404));
        res.status(200).json(user);
    }
    catch(err){
        if(err.code === 11000) return next(new AppError('email is already exists', 400));
        next(err);
    }
};

exports.deleteUser = async(req, res, next) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return next(new AppError('Invalid user ID', 400));

        const user = await User.findByIdAndDelete(id);
        if(!user) return next(new AppError('user not found', 404));
        res.status(200).json(user);
    }
    catch(err){
        next(err);
    }
};