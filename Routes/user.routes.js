const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/auth");
const upload = require("../Middleware/upload");

const {
    getMe,
    updateDetails,
    updatePassword,
    uploadProfilePicture,
    removeProfilePicture
} = require("../Controllers/user.controller");

router.get("/me", protect, getMe);
router.put("/update", protect, updateDetails);
router.put("/update-password", protect, updatePassword);
router.post("/upload-profile-picture", protect, upload.single('profilePicture'), uploadProfilePicture);
router.delete("/remove-profile-picture", protect, removeProfilePicture);

module.exports = router;