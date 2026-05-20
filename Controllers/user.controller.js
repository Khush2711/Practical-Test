const User = require("../Models/user.model");
const bcrypt = require('bcryptjs');

// get user details
const getMe = async (req, res) => {
    try {
        res.json({
            success: true,
            user: req.user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// update user details
const updateDetails = async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        const updates = {};

        if (firstName) updates.firstName = firstName;
        if (lastName) updates.lastName = lastName;
        if (email) updates.email = email;

        if (email) {
            const exist = await User.findOne({ email, _id: { $ne: req.user._id } });
            if (exists) {
                return res.status(409).json({
                    success: false,
                    message: "Email id is already in use"
                })
            }
        }

        const user = await User.findByIdAndUpdate(req.user.id, updates, {
            new: true,
            runValidators: true
        }).select('-password -refreshToken');

        return res.json({
            success: true,
            message: "Profile Updated",
            user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

// update user password
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Both Fields are required"
            })
        }

        const user = await User.findById(req.user._id);

        // Check Current Password
        if (!(await user.matchPassword(currentPassword))) {
            return res.status(401).json({
                success: false,
                message: "Current Password is incorrect"
            })
        }

        user.password = newPassword;
        user.confirmPassword = newPassword;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "password updated successfully"
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

module.exports = {
    getMe,
    updateDetails,
    updatePassword
}