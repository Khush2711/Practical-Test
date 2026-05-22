const User = require("../Models/user.model");
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

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
            if (exist) {
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

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.confirmPassword = hashedPassword;

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

// upload profile picture
const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image provided" });
        }

        const user = await User.findById(req.user._id);
        
        // Remove old profile picture if exists
        if (user.profilePicture) {
            const oldPath = path.join(__dirname, '..', user.profilePicture);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        user.profilePicture = req.file.path.replace(/\\/g, '/');
        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile picture uploaded successfully",
            profilePicture: user.profilePicture
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// remove profile picture
const removeProfilePicture = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user.profilePicture) {
            const oldPath = path.join(__dirname, '..', user.profilePicture);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
            user.profilePicture = null;
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: "Profile picture removed successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    getMe,
    updateDetails,
    updatePassword,
    uploadProfilePicture,
    removeProfilePicture
}