const express = require("express")
const musicController = require("../controllers/music.controller")
const router = express.Router()
const authMiddleware = require("../middleware/auth.middleware")

const multer = require('multer')

const upload = multer({
    storage: multer.memoryStorage(),
    // limits: {
    //     fileSize: 10 * 1024 * 1024
    // }
})



router.post("/upload", authMiddleware.authArtist, upload.single("music"), musicController.createMusic)
router.post("/album", authMiddleware.authArtist, musicController.createAlbum)
router.get("/", authMiddleware.authUser, musicController.geAllMusics)
router.get("/album", authMiddleware.authUser, musicController.getAllAlbums)
router.get("/album/:albumId", authMiddleware.authUser, musicController.getAlbumById)

module.exports = router