module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        status: statusCode >= 500 ? 'error': "fail",
        message: err.message
    })
}