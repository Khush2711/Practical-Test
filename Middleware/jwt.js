const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) =>
    jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

const generateRefreshToken = (userId) =>
    jwt.sign({ id: userId }, process.env.REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_EXPIRES_SECRET,
    });

const verifyAccessToken = (token) =>
    jwt.verify(token, process.env.JWT_SECRET);

const verifyRefreshToken = (token) =>
    jwt.verify(token, process.env.REFRESH_SECRET);

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}