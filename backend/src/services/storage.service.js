const { ImageKit } = require('@imagekit/nodejs')



const ImageKitClient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile(file, fileName) {
    const result = await ImageKitClient.files.upload({
        file: file, // ImageKit supports Buffer directly
        fileName: fileName || "music_" + Date.now(),
        folder: "spotify/music" // changed folder name to spotify for better organization
    })
    return {
        url: result.url
    }
}



module.exports = { uploadFile }