const express = require('express')
const cookieParser = require("cookie-parser")
const cors = require("cors")
const authRoutes = require("./routes/auth.routes")
const musicRoutes = require("./routes/music.routes")

const app = express()

app.use(cors({
    origin: ['https://spotify-taupe-five.vercel.app', 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// Health check endpoint for Render/Uptime pings
app.get('/api/ping', (req, res) => {
    res.status(200).json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/music', musicRoutes)

module.exports = app