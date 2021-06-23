const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const {promisify} = require('util');
const {bat} = require('../../.config');

const image = promisify(crypto.pseudoRandomBytes);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, bat.folder);
  },
  filename: async (req, file, cb) => {
    const raw = await image(16);
    cb(null, raw.toString('hex') + path.extname(file.originalname));
  },
});

const Upload = multer({storage});

module.exports = {Upload};
