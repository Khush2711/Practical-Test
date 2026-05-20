const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/auth");

const {
    getMe,
    updateDetails,
    updatePassword
} = require("../Controllers/user.controller");

router.get("/me", protect, getMe);
router.put("/update", protect, updateDetails);
router.put("/update-password", protect, updateDetails);

module.exports = router;