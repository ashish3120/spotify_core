const express = require('express')
const cookieParser = require("cookie-parser")
const cors = require("cors")
const authRoutes = require("./routes/auth.routes")
const musicRoutes = require("./routes/music.routes")


const app = express()
app.use(cors({
    origin: true, // Allow all origins for now (can be restricted to frontend URL later)
    credentials: true, // Crucial for cookie transmission
}))
app.use(express.json()) //middleware for parsing json data
app.use(cookieParser()) //middleware for parsing cookies


app.use('/api/auth', authRoutes)
app.use('/api/music', musicRoutes)



module.exports = app