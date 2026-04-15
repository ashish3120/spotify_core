const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs") //used for hashing and comparing passwords



async function registerUser(req, res) {
    const { username, email, password, role = "user" } = req.body

    //check if unique username and email exist or not
    const isUserAlreadyExists = await userModel.findOne({
        $or: [ //$or multiple condition lega if koi ek bhi found to return true
            { username: username },
            { email: email }
        ]
    })


    if (isUserAlreadyExists) {
        return res.status(409).json({
            message: "User already exists"
        })
    }

    const hash = await bcrypt.hash(password, 10) //10 is salt which adds unique random value to the password

    const user = await userModel.create({
        username,
        email,
        password: hash,
        role
    })

    const token = jwt.sign({
        id: user._id,
        role: user.role,
    }, process.env.JWT_SECRET)

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true // Keep secure: true for now since backend is on Render HTTPS
    })

    res.status(201).json({
        message: "User registered successfully",
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
        $or: [ //this takes either of one if one value is given it runs
            { username },
            { email }
        ]
    })

    if (!user) {
        return res.status(401).json({
            message: "Invalid username or email "
        })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid password"
        })
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET)


    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true
    })

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })

}

async function logoutUser(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "none",
        secure: true
    })
    res.status(200).json({
        message: "User logged out successfully"
    })
}



module.exports = { registerUser, loginUser, logoutUser }