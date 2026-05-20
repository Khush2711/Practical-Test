const express = require("express");
const router = express.Router();
const ratelimit = require("express-rate-limit");


const {
    register,
    login,
    logout,
    refresh
} = require("../Controllers/auth.controller");

const limiter = ratelimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false, message: "Too Many Request, Please try again after 1 minute"
    }
});

router.use(limiter);

router.post('/register', register);
router.post('/login', login);

module.exports = router;