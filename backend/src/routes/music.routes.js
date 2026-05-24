const express = require("express")
const musicController = require("../controllers/music.controller")
const router = express.Router()
const authMiddleware = require("../middleware/auth.middleware")

const multer = require('multer') //multer is used for handling file uploads

const upload = multer({
    storage: multer.memoryStorage(), //multer stores files in memory
    limits: {
        fileSize: 50 * 1024 * 1024 // 50 MB max
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('audio/')) {
            cb(null, true)
        } else {
            cb(new Error('Only audio files are allowed'), false)
        }
    }
})



router.post("/upload", authMiddleware.authArtist, upload.single("music"), musicController.createMusic)
router.post("/album", authMiddleware.authArtist, musicController.createAlbum)
router.get("/", authMiddleware.authUser, musicController.geAllMusics)
router.get("/album", authMiddleware.authUser, musicController.getAllAlbums)
router.get("/album/:albumId", authMiddleware.authUser, musicController.getAlbumById)

module.exports = router