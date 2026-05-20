require("dotenv").config();
const mongoose = require("mongoose");

const DB_URL = process.env.DB_URL;

async function connect_db(){
    try {
        await mongoose.connect(DB_URL);
        console.log("DB Connection Successfully....");
    } catch (error) {
        console.error("DB Connection Failed...",error);
        process.exit();
    }
}

module.exports = connect_db;