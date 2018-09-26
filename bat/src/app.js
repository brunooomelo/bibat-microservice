const express = require('express')
const bodyParser = require('body-parser')
const { Upload } = require('./config/multer')
const Bat = require('./models/bat')
require('./config/database')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/bat', async (req, res) => {
  const data = await Bat.find()
  res.json({ bat: data })
})

app.get('/bat/:id', async (req, res) => {
  const { id } = req.params
  const data = await Bat.findOne({ _id: id })
  res.json({ user: data })
})

app.post('/bat', Upload.single('file'), async (req, res) => {
  let data = new Bat({ ...req.body, file: {...req.file}, star: 0 })
  res.json({ data: data.save() })
})

app.post('/bat/:id/star', async (req, res) => {
  const { id } = req.params
  let bat = await Bat.findOne({ _id: id })
  let data = await Bat.updateOne({ _id: id }, { star: bat.star + 1 })
  res.json({ data })
})

app.patch('/bat/:id', async (req, res) => {
  const { id } = req.params
  let data = await Bat.updateOne({ _id: id }, req.body)
  res.json({ data })
})


app.listen('3001', () => ( console.log('Server listen 3001') ))
