'use strict';

const { createUserHandler, loginHandler, requestPasswordResetHandler, resetPasswordHandler } = require("../controller/user.controller");
const { requiresResetToken } = require("../middleware/requiresResetToken");

module.exports = (app) => {
    // PING SERVER
    app.get('/ping', (req, res) => {res.status(200).json({ status: "OK" })});

    // CREATE A USER
    app.post('/users/signup', createUserHandler)

    // CREATE A USER IN
    app.post('/users/login', loginHandler)

    // REQUEST USER PASSWORD RESET
    app.post('/users/request-reset', requestPasswordResetHandler)

    // RESET PASSWORD
    app.post('/users/reset-password', requiresResetToken, resetPasswordHandler)
};
