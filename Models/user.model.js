const mongoose = require("mongoose");
const bycrpt = require("bcryptjs")
// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const userData = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email Id is required"],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        min: 8
    },
    confirmPassword: {
        type: String,
        required: [true, "Confirmed Password is required"],
        min: 8
    },
    refreshToken: {
        type: String,
        default: null
    },
    profilePicture: {
        type: String,
        default: null
    }
},
    { timestamps: true }
);

// Hash Password
// userData.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bycrpt.hash(this.password, 10);
//     next();
// });

// Compare Password
userData.methods.matchPassword = function (entered) {
    return bycrpt.compare(entered, this.password);
}

const MyModel = mongoose.model('user', userData);

module.exports = MyModel;