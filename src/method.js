/**
 * Replicating color theif npm module using ES-6 features and async await
 * @author Amy Le
 * @orignalAuthor Lokesh Dhakar - Home page: lokeshdhakar.com
 * @license npmjs.com/package/color-thief#license
 * @date 4 April 2022
 */
const getPixels = require('get-pixels')
const quantize = require('quantize')

const createPixelArray = (imgData, pixelCounts, quality) => {
    const pixelArray = []
    const pixels = imgData

    // resource to understand: https://www.youtube.com/watch?v=qgKwXZSnSdY
    for (let i = 0, set, r, g, b, a; i < pixelCounts; i = i + quality) {
        set = i * 4
        r = pixels[set + 0]
        g = pixels[set + 1]
        b = pixels[set + 2]
        a = pixels[set + 3]

        if (typeof a === "undefined" || a >= 125) {
            if (r <= 255 && g <= 255 && b <= 255) {
                pixelArray.push([r, g, b])
            }
        }
    }
    return pixelArray
}

const validate = ({ colorCount, quality }) => {

    //colorCount aka number of colors in palette
    if (colorCount == 'undefined' || !Number.isInteger(colorCount)) {
        colorCount = 10
    } else if (colorCount === 1) {
        throw new Error('colorCount need to be between 2 and 20')
    }

    //quality is number of pixels skip
    if (!(quality >= 1 && quality <= 10)) {
        quality = 10
    }

    return {
        colorCount,
        quality
    }
}

const loadImg = (imgPath, type) => {
    return new Promise((resolve, reject) => {
        getPixels(imgPath, type, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

const getPalette = async(imgPath, type, colorCount, quality) => {
    const options = validate({
        colorCount,
        quality
    })

    //return promise
    const data = await loadImg(imgPath, type)
        // console.log(data)
    const pixelCount = data.shape[0] * data.shape[1]
    const pixelArray = createPixelArray(data.data, pixelCount, options.quality)
    const colorMap = quantize(pixelArray, options.colorCount)
    const palette = colorMap ? colorMap.palette() : null
    return palette
}

module.exports = getPalette