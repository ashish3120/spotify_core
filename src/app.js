const express = require('express')
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/auth.routes")
const musicRoutes = require("./routes/music.routes")


const app = express()
app.use(express.json())//middleware for parsing json data
app.use(cookieParser())//middleware for parsing cookies


app.use('/api/auth', authRoutes)
app.use('/api/music', musicRoutes)



module.exports = app