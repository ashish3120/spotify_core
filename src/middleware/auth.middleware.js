const jwt = require("jsonwebtoken")

async function authArtist(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorised Access"
        })
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        if (decodedToken.role !== "artist") {
            return res.status(403).json({
                message: "You don't have permission to upload music"
            })
        }

        req.user = decodedToken //is line me hum user ko attach kar rahe hai
        next()  //next isliye use kiye hai kyuki iske baad jo bhi function call hoga usme decodedToken ko access kar sakte hai
    }
    catch (err) {
        console.log(err)
        return res.status(401).json({
            message: "Invalid token"
        })
    }


}

async function authUser(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorised Access"
        })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        if (decodedToken.role !== "user" && decodedToken.role !== "artist") {
            return res.status(403).json({
                message: "You don't have permission to access this resource"
            })
        }

        req.user = decodedToken //is line me hum user ko attach kar rahe hai
        next()  //next isliye use kiye hai kyuki iske baad jo bhi function call hoga usme decodedToken ko access kar sakte hai
    }
    catch (err) {
        console.log(err)
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}


module.exports = { authArtist, authUser }