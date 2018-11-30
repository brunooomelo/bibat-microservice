const express = require('express')
const path = require('path')
const { Upload } = require('./config/multer')
const Bat = require('./models/bat')
const middle = require('./services/auth')
const { bat } = require('../.config')
require('./config/database')
const app = express()

app.use(express.json())

app
  .get('/bat', middle, async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query
      const data = await Bat.paginate(
        {},
        {
          page: parseInt(page),
          limit: parseInt(limit)
        }
      )
      res.json({ bat: data })
    } catch (error) {
      res.json({ error: error.message, type: error.name })
    }
  })

  .get('/bat/:id', middle, async (req, res) => {
    try {
      const { id } = req.params
      const data = await Bat.findOne({ _id: id })
      res.json({ user: data })
    } catch (error) {
      res.json({ error: error.message, type: error.name })
    }
  })

  .post('/bat', middle, Upload.single('file'), async (req, res) => {
    try {
      await Bat.create({
        ...req.body,
        file: { ...req.file },
        owner: req.owner
      })
      res.json({ message: 'arquivo cadastrado' })
    } catch (error) {
      res.json({ error: error.message, type: error.name })
    }
  })

  .patch('/bat/:id', middle, async (req, res) => {
    try {
      const { id } = req.params
      let data = await Bat.updateOne({ _id: id }, req.body)
      res.json({ data })
    } catch (error) {
      res.json({ error: error.message, type: error.name })
    }
  })

  .get('/bat/:id/download', async (req, res) => {
    try {
      const { id } = req.params
      const { file } = await Bat.findOne({ _id: id })
      res.download(path.join(bat.folder, file.filename), file.originalname)
    } catch (error) {
      res.json({ error: error.message, type: error.name })
    }
  })

app.listen(bat.PORT, () => console.log('server listering in port ' + bat.PORT))
