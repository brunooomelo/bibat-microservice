const multer = require('multer')
const crypto = require('crypto')
const path = require('path')
const { promisify } = require('util')

const image = promisify(crypto.pseudoRandomBytes)

const storage = multer.diskStorage({
  destination: 'uploads',
  filename: async (req, file, cb) => {
    const raw = await image(16)
    cb(null, raw.toString('hex') + path.extname(file.originalname))
  }
})

const Upload = multer({ storage })

module.exports = { Upload }
