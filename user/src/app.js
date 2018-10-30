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
  try {
    if (!req.body.email) {
      res.json({ error: 'params email é requirido' })
      return false
    }
    if (!req.body.username) {
      res.json({ error: 'params username é requirido' })
      return false
    }
    const {
      email,
      username
    } = req.body

    const emailDuplicate = await User.findOne({ email })
    const usernameDuplicate = await User.findOne({ username })

    if (usernameDuplicate) {
      res.json({ error: 'Usuario já existe' })
      return false
    }
    if (emailDuplicate) {
      res.json({ error: 'Email já existe' })
      return false
    }

    await User.create(req.body)
    res.json({ message: 'Usuario cadastrado com sucesso' })
  } catch (error) {
    res.json({ error: error.message, type: error.name })
  }
  return false
})

app.post('/user/:id/active', async (req, res) => {
  const { id } = req.params
  const data = await User.updateOne({ _id: id }, { isActive: true })
  res.json({ data })
})

app.patch('/user/:id', async (req, res) => {
  const { id } = req.params
  const data = await User.updateOne({ _id: id }, req.body)
  res.json({ data })
})

app.listen('3000', () => {
  process.stdout.write('server listering in port 3000 \n')
})
