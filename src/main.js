const express = require('express')
const sharp = require('sharp')
const multer = require('multer')
const getPalette = require('./method')
const getPalette2 = require('./sub-method')

const app = express()
const port = process.env.PORT || 3000
app.use(express.json())

const storage = multer.memoryStorage()
const upload = multer({
    // limits: {
    //     fileSize: 1000000
    // },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    },
    storage: storage
})


app.post('/test', async(req, res) => {
    try {
        const palette = await getPalette2(req.body.path, 5, 10)
        const json = JSON.stringify(palette)
        res.send(json)
    } catch (e) {
        res.status(400).send(e)
    }

})

app.post('/test2', upload.single('img'), async(req, res) => {
    try {
        if (req.query.type === 'upload') {
            const imgPath = await sharp(req.file.buffer).png().toBuffer()
            palette = await getPalette(imgPath, 'image/png', 5, 10)
        } else {
            palette = await getPalette2(req.body.path, 5, 10)
        }
        const json = JSON.stringify(palette)
        console.log(json)
        res.send(json)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.post('/test3', upload.single('img'), async(req, res) => {
    try {
        imgPath = await sharp(req.file.buffer).png().toBuffer()
        const palette = await getPalette(imgPath, 'image/png', 5, 10)
        const json = JSON.stringify(palette)
        res.send(json)
    } catch (e) {
        res.status(400).send("something is wrong")
    }
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})