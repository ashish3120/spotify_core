const { ImageKit } = require('@imagekit/nodejs')



const ImageKitClient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile(file) {
    const result = await ImageKitClient.files.upload({
        file: file.toString("base64"),
        fileName: "music_" + Date.now(),
        folder: "yt-complete-backend/music"
    })
    return {
        url: result.url
    }
}



module.exports = { uploadFile }