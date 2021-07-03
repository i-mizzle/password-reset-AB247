const response = require('./../responses');
const jwt = require("../utils/jwt.utils")

const requiresResetToken = async (req, res, next) => {
    try {
        const resetToken = req.headers['reset-token']
        const decodedToken = jwt.decode(resetToken)
        const isExpired = decodedToken.expired
        const isValid = decodedToken.valid

        if (!resetToken || !isValid) {
            return response.unAuthorized(res, { message: 'Sorry, you are not authorized to access this resource' })
        }

        const user = decodedToken.decoded._doc        
    
        if (isExpired) {
            return response.unAuthorized(res, { message: 'Sorry, your reset token has expired and you no longer have access to this resource' });
        }
    
        req.user = user
        return next();

    } catch (error) {
        return response.error(res, error) 
    }
}

module.exports = { requiresResetToken }