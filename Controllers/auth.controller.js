const User = require("../Models/user.model");
const bcrypt = require("bcryptjs");
const {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
} = require("../Middleware/jwt");

const register = async (req, res) => {
    try {
        const { email, firstName, lastName, password, confirmPassword } = req.body;

        if (!email || !firstName || !lastName || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        
        if (confirmPassword !== password) {
            return res.status(400).json({
                success: false,
                message: "Confirm password and password doesn't match"
            })
        }

        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(409).json({
                success: false,
                message: "Email Id already registered"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({ email, firstName, lastName, password:hashedPassword, confirmPassword: hashedPassword });

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Registered Successfully",
            accessToken,
            refreshToken,
            user: { id: user._id, name: user.name, email: user.email }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid credential"
            })
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);


        user.refreshToken = refreshToken;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Registered Successfully",
            accessToken,
            refreshToken,
            user: { id: user._id, name: user.name, email: user.email }
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = User.findOne({ refreshToken });

        if (user) {
            user.refreshToken = null;
            await user.save();
        }

        return res.status(200).json({
            success: true,
            message: "Logout Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const decoded = verifyRefreshToken(refreshToken);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({
                success: false,
                message: "Invalid refresh token"
            })
        }

        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        user.refreshToken = newRefreshToken;
        await user.save();

        return res.status(200).json({
            success: true,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    register,
    login,
    logout,
    refresh
}