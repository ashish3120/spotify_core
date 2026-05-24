const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["artist", "user"],
        default: "user"
    },
    refreshToken: {
        type: String,
        default: null
    }
})


const userModel = mongoose.model("user", userSchema)

module.exports = userModel