const jwt = require("jsonwebtoken")

function getAccessTokenFromHeader(req) {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.split(" ")[1]
    }
    return null
}

async function authArtist(req, res, next) {
    const token = getAccessTokenFromHeader(req)

    if (!token) {
        return res.status(401).json({
            message: "Unauthorised Access"
        })
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedToken
        if (req.user.role !== "artist") {
            return res.status(403).json({
                message: "only artist can access this page"
            })
        }
        next()
    }
    catch (err) {
        console.error("AuthArtist error:", err)
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}

async function authUser(req, res, next) {
    const token = getAccessTokenFromHeader(req)

    if (!token) {
        return res.status(401).json({
            message: "Unauthorised Access"
        })
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedToken
        next()
    }
    catch (err) {
        console.error("AuthUser error:", err)
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}

module.exports = { authArtist, authUser }