const express = require("express");
const router = express.Router();

const {
    logout,
    refresh
} = require("../Controllers/auth.controller");

router.post('/logout', logout);
router.post('/refresh', refresh);

module.exports = router;