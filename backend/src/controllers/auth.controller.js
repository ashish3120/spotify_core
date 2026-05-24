const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { recordFailedAttempt, resetAttempts } = require("../middleware/loginLimiter.middleware")

function generateAccessToken(user) {
    return jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '30m' })
}

function generateRefreshToken(user) {
    const secret = process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET + "_refresh")
    return jwt.sign({
        id: user._id,
        role: user.role
    }, secret, { expiresIn: '10h' })
}

function setTokenCookies(res, refreshToken) {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 10 * 60 * 60 * 1000 // 10 hours in ms
    })
}

async function registerUser(req, res) {
    const { username, email, password, role = "user" } = req.body

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    })

    if (isUserAlreadyExists) {
        return res.status(409).json({
            message: "User already exists"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash,
        role
    })

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    // Save refresh token to database
    user.refreshToken = refreshToken
    await user.save()

    setTokenCookies(res, refreshToken)

    res.status(201).json({
        message: "User registered successfully",
        accessToken,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })
}

async function loginUser(req, res) {
    const { username, email, password } = req.body

    const user = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (!user) {
        const locked = recordFailedAttempt(req.body)
        if (locked) {
            return res.status(423).json({
                message: "This account has been temporarily locked due to too many failed attempts. Please try again in 15 minutes."
            })
        }
        return res.status(401).json({
            message: "Invalid credentials"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        const locked = recordFailedAttempt(req.body)
        if (locked) {
            return res.status(423).json({
                message: "This account has been temporarily locked due to too many failed attempts. Please try again in 15 minutes."
            })
        }
        return res.status(401).json({
            message: "Invalid credentials"
        })
    }

    resetAttempts(req.body)

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    // Save refresh token to database
    user.refreshToken = refreshToken
    await user.save()

    setTokenCookies(res, refreshToken)

    res.status(200).json({
        message: "User logged in successfully",
        accessToken,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })
}

async function logoutUser(req, res) {
    const { refreshToken } = req.cookies

    if (refreshToken) {
        try {
            const secret = process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET + "_refresh")
            const decoded = jwt.verify(refreshToken, secret)
            await userModel.findByIdAndUpdate(decoded.id, { refreshToken: null })
        } catch (err) {
            // Ignore token verification errors on logout and proceed with clearing cookies
        }
    }

    res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true
    })
    res.status(200).json({
        message: "User logged out successfully"
    })
}

async function refreshUserToken(req, res) {
    const { refreshToken } = req.cookies
    if (!refreshToken) {
        return res.status(401).json({
            message: "Authentication required"
        })
    }

    try {
        const secret = process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET + "_refresh")
        const decoded = jwt.verify(refreshToken, secret)

        const user = await userModel.findById(decoded.id)

        // Strictly validate request refresh token matches database
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                message: "Invalid or expired session"
            })
        }

        const newAccessToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user)

        user.refreshToken = newRefreshToken
        await user.save()

        setTokenCookies(res, newRefreshToken)

        res.status(200).json({
            message: "Token refreshed successfully",
            accessToken: newAccessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    } catch (err) {
        console.error("Refresh token error:", err)
        return res.status(401).json({
            message: "Invalid or expired session"
        })
    }
}

module.exports = { registerUser, loginUser, logoutUser, refreshUserToken }