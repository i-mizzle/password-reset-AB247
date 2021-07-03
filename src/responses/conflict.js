module.exports = (res, error) => {
    return res.status(409).send({
        'status': false,
        'message': error.message,
        'stack': error.stack
    });
};
