const mongoose = require("mongoose")
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("database connected")
    }
    catch (err) {
        console.error("database not connected", err)
    }
}

module.exports = connectDB