'use-strict';
const { omit } = require('lodash');
const { createUser, validatePassword, createAccessToken, find, changeUserPassword } = require('../service/user.service');
const response = require('./../responses');

async function createUserHandler(req, res) {
    try {
        const user = await createUser(req.body)
        if (user.error) {
            return response[user.errorType](res, user.data)
        }

        return response.created(res, omit(user.data.toJSON(), 'password'))

    } catch (error) {
        return response.error(res, error)
    }
}

async function loginHandler(req, res) {
    try {
        const user = await validatePassword(req.body);

        if (!user) {
            return response.unAuthorized(res, { message: "invalid username or password" })
        }

        const tokenFor = 'LOGIN'
        const accessToken = createAccessToken({
            user, tokenFor
        });

        if (accessToken.error) {
            return response[user.errorType](res, accessToken.data)
        }

        return response.ok(res, { 
            accessToken: accessToken.data
        })

    } catch (error) {
        return response.error(res, error)
    }
}

async function requestPasswordResetHandler(req, res) {
    try {
        const user = await find(req.body);
        if (!user) {
            return response.badRequest(res, { message: "Sorry, we don't have that email registered with us" })
        }

        const tokenFor = 'PASSWORD-RESET'
        const passwordResetToken = createAccessToken({
            user, tokenFor
        });
        
        if (passwordResetToken.error) {
            return response[user.errorType](res, passwordResetToken.data)
        }

        return response.ok(res, { 
            passwordResetToken: passwordResetToken.data
        })

    } catch (error) {
        return response.error(res, error)
    }
}

async function resetPasswordHandler(req, res) {
    try {
        const userId = req.user._id
        const updatedUser = changeUserPassword(userId, req.body)
        
        if( updatedUser.error ) {
            return response[user.errorType](res, updatedUser.data)
        }

        return response.ok(res, { data: "Password has been reset successfully, you can now log in with your new password" })

    } catch (error) {
        return response.error(res, error)
    }
}

module.exports = { createUserHandler, loginHandler, requestPasswordResetHandler, resetPasswordHandler }