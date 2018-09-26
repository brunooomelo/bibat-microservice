const express = require('express')
const bodyParser = require('body-parser')
const User = require('./models/user')
require('./config/database')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/user', async (req, res) => {
  const data = await User.find()
  res.json({ user: data })
})

app.get('/user/:id', async (req, res) => {
  const { id } = req.params
  const data = await User.findOne({ _id: id })
  res.json({ user: data })
})

app.post('/user', async (req, res) => {
  let data = new User(req.body)
  res.json({ data: data.save() })
})

app.post('/user/:id/active', async (req, res) => {
  const { id } = req.params
  let data = await User.updateOne({ _id: id }, { isActive: true })
  res.json({ data })
})

app.patch('/user/:id', async (req, res) => {
  const { id } = req.params
  let data = await User.updateOne({ _id: id }, req.body)
  res.json({ data })
})


app.listen('3000', () => ( console.log('Server listen 3000') ))


