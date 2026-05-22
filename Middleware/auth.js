const { verifyAccessToken } = require("./jwt");
const User = require("../Models/user.model");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // check authHeader
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            })
        }

        // Remove Bearer
        const token = authHeader.split(' ')[1];
        const decode = verifyAccessToken(token);

        const user = await User.findById(decode.id).select('-password -refreshToken');

        if (!user) {
            return res.status(401).json({
                success: false,
                message : "User not found"
            })
        }

        // TODO : Remove passwords from user
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Invalid or Expired Token"
        })
    }
}

module.exports = {
    protect
};