// const mongoose = require("mongoose");
// const User = mongoose.model('User');
const User = require('../model/user.model')
const jwt = require("../utils/jwt.utils")
const { omit } = require('lodash')

async function createUser(input) {
    try {
        const user = new User({
            name: input.name,
            email: input.email,
            phone: input.phone
        })
        user.password = user.encryptPassword(input.password);

        await user.save();
        return {
            error: false,
            errorType: '',
            data: user
        }
    } catch (error) {
        return {
            error: true,
            errorType: 'error',
            data: error
        }
    }
}

const find = async (condition) => {
    return User.findOne(condition, { password: 0, __v: 0 });
}

async function validatePassword({email, password}) {
    try {
        const user = await User.findOne({ email });        
        const isValid = await user.isValidPassword(password);
        if (!isValid) {
            return false
        }
        return omit(user.toJSON(), 'password');
    } catch (error) {
        throw new Error(error)
    }
}

function createAccessToken({user, tokenFor}) {
    try {
        const privateKey = process.env.PRIVATE_KEY
        let ttl = process.env.ACCESS_TOKEN_TTL
        if( tokenFor === 'PASSWORD-RESET' ) { ttl = '10m' }

        const accessToken = jwt.sign(
            { ...user },
            privateKey,
            { expiresIn: ttl }
        );

        return {
            error: false,
            errorType: '',
            data: accessToken
        }
        // return accessToken;
    } catch (error) {
        return {
            error: true,
            errorType: 'error',
            data: error
        }
    }
}

async function changeUserPassword(userId, input) {
    try {
        const user = await User.findOne({_id: userId})
            if (user) {
                user.password = user.encryptPassword(input.password)
                const updatedUser = await user.save()
                return {
                    error: false,
                    errorType: '',
                    data: updatedUser
                }
            } else {
                return {
                    error: true,
                    errorType: 'conflict',
                    data: { message: 'user not found' }
                }
            }
        
    } catch (error) {
        
    }
}

module.exports = {
    createUser, validatePassword, createAccessToken, find, changeUserPassword
}