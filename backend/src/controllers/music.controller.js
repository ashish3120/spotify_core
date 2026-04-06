const musicModel = require("../models/music.model")
const jwt = require("jsonwebtoken")
const { uploadFile } = require("../services/storage.service")
const albumModel = require("../models/album.model")

async function createMusic(req, res) {
    const token = req.cookies.token;

    // if (!token) {
    //     return res.status(401).json({
    //         message: "Unauthorised Access"
    //     })
    // }
    // try {
    // const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    // if (decodedToken.role !== "artist") {
    //     return res.status(403).json({
    //         message: "You don't have permission to upload music"
    //     })
    // }



    const { title } = req.body
    const file = req.file;

    const result = await uploadFile(file.buffer, file.originalname)

    const music = await musicModel.create({
        uri: result.url,
        title,
        artist: req.user.id,
    })

    res.status(201).json({
        message: "Music uploaded successfully",
        music: {
            id: music._id,
            title: music.title,
            uri: music.uri,
            artist: music.artist
        }
    })
    // }
    // catch (err) {
    //     console.log(err)
    //     return res.status(401).json({
    //         message: "Invalid token"
    //     })
    // }

}

async function createAlbum(req, res) {
    const token = req.cookies.token;

    // if (!token) {
    //     return res.status(401).json({
    //         message: "Unauthorised Access"
    //     })
    // }
    // try {
    //     const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    //     if (decodedToken.role !== "artist") {
    //         return res.status(403).json({
    //             message: "You don't have permission to upload music"
    //         })
    //     }



    const { title, musics } = req.body

    const album = await albumModel.create({
        title,
        artist: req.user.id,
        musics: musics
    })

    res.status(201).json({
        message: "Album created successfully",
        album: {
            id: album._id,
            title: album.title,
            artist: album.artist,
            musics: album.musics
        }
    })
    // }
    // catch (err) {
    //     console.log(err)
    //     return res.status(401).json({
    //         message: "Invalid token"
    //     })
    // }

}

async function geAllMusics(req, res) {
    //we should not give all the music to the user as no of songs can be too much
    // const musics = await musicModel.find().populate("artist", "username") //populate will here give the data of artist instead of id 
    const musics = await musicModel.find().limit(20).populate("artist", "username") //limit will give only 1 song as we have set limit to 1 which is the upper limit skip will skip the first 2 songs

    res.status(200).json({
        message: "Musics fetched successfully",
        musics
    })
}

async function getAllAlbums(req, res) {
    const albums = await albumModel.find().select("title artist").populate("artist", "username") //select here will only show title and artist and populate will show the username of the artist

    res.status(200).json({
        message: "Albums fetched successfully",
        albums
    })
}

async function getAlbumById(req, res) {
    const albumId = req.params.albumId
    const album = await albumModel.findById(albumId).populate("artist", "username")

    if (!album) {
        return res.status(404).json({
            message: "Album not found"
        })
    }
    res.status(200).json({
        message: "Album fetched successfully",
        album
    })
}

module.exports = { createMusic, createAlbum, geAllMusics, getAllAlbums, getAlbumById }
