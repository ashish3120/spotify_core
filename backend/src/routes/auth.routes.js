const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth.controller")
const { checkLoginLock } = require("../middleware/loginLimiter.middleware")

router.post('/register', authController.registerUser)
router.post('/login', checkLoginLock, authController.loginUser)
router.post('/logout', authController.logoutUser)
router.post('/refresh', authController.refreshUserToken)

module.exports = router