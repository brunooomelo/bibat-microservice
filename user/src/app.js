const express = require('express')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const middle = require('./services/middleware/auth')
const cors = require('cors')
const crypto = require('crypto')
const mailer = require('./services/mailer/')
require('./config/database')

const app = express()

app.use(express.json())
app.use(cors())

// listagem de todos os usuarios
app
  .get('/user', middle, async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    const data = await User.paginate(
      {},
      { page: parseInt(page), limit: parseInt(limit) }
    )
    res.json(data)
  })
  // listagem usuario especifico
  .get('/user/:id', middle, async (req, res) => {
    const { id } = req.params
    const data = await User.findOne({ _id: id })
    res.json({ user: data })
  })
  // criacao de usuario
  .post('/user', middle, async (req, res) => {
    try {
      if (!req.body.email) {
        res.json({ error: 'params email é requirido' })
        return false
      }
      if (!req.body.username) {
        res.json({ error: 'params username é requirido' })
        return false
      }
      const { email, username } = req.body

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
  // desativar usuario
  .post('/user/:id/active', middle, async (req, res) => {
    const { id } = req.params
    const data = await User.updateOne({ _id: id }, { isActive: true })
    res.json({ data })
  })
  // alterar usuario
  .put('/user/:id', middle, async (req, res) => {
    const { id } = req.params
    const data = await User.updateOne({ _id: id }, req.body)
    res.json({ data })
  })
  // autenticar usuario
  .post('/auth', async (req, res) => {
    if (!req.body['grant_type']) {
      return res.status(406).json({ error: 'grant_type is missing' })
    }

    if (!['refresh_token', 'signin'].includes(req.body['grant_type'])) {
      return res.status(406).json({ error: 'grant_type: method invalid' })
    }

    if (req.body['grant_type'] === 'refresh_token') {
      if (!req.headers.authorization) {
        return res.status(406).json({ error: 'token is missing' })
      }
      let token = req.headers.authorization.split(' ')
      jwt.verify(token[1], 'secret', { ignoreExpiration: true }, function (
        err,
        decoded
      ) {
        if (err) {
          return res.status(406).json({ error: 'token is invalid' })
        }
        return res.status(201).json({
          token: jwt.sign(
            { username: decoded.username, email: decoded.email },
            'secret',
            { expiresIn: '3m' }
          )
        })
      })
    }

    if (req.body['grant_type'] === 'signin') {
      try {
        if (!req.body['username'] && !req.body['login']) {
          return res.status(406).json({ error: 'username is missing' })
        }
        if (!req.body['password']) {
          return res.status(406).json({ error: 'password is missing' })
        }

        const password = req.body.password
        const login = req.body.login || req.body.username

        let user = await User.findOne({
          $or: [
            {
              username: login
            },
            {
              email: login
            }
          ]
        }).select('+password')

        if (!user || !(await bcrypt.compare(password, user.password))) {
          return res
            .status(400)
            .json({ error: 'usuario ou senha esta incorreto' })
        }
        if (!user.isActive) {
          return res.status(400).json({ error: 'usuario não esta ativo' })
        }
        user.password = undefined
        return res.status(201).json({
          token: jwt.sign({ user }, 'secret')
        })
      } catch (error) {
        res.json(error)
      }
    }
  })

  // resetar a senha enviando por email
  .post('/forgot_password', async (req, res) => {
    try {
      if (!req.body['email']) {
        return res.status(406).json({ error: 'email is missing' })
      }
      const { email } = req.body

      let user = await User.findOne({
        email
      })

      if (!user) {
        return res
          .status(400)
          .json({ error: 'usuario ou email não encontrado' })
      }

      const token = crypto.randomBytes(20).toString('hex')

      const now = new Date()
      now.setHours(now.getHours() + 1)

      await User.findByIdAndUpdate(user.id, {
        $set: {
          passwordResetToken: token,
          passwordResetExpires: now
        }
      })

      mailer.sendMail(
        {
          to: email,
          from: 'utibmelo@gmail.com',
          template: 'template/forgot_password',
          context: { token }
        },
        err => {
          if (err) {
            return res.status(400).json({
              error: 'cannot send forgot password email'
            })
          }
          return res.json()
        }
      )
    } catch (error) {
      return res
        .status(400)
        .send({ error: 'Error on forgot password, try agian' })
    }
  })
  // reset a senha pela senha enviada por email
  .post('/reset_password', async (req, res) => {
    try {
      const { email, token, password } = req.body
      let user = await User.findOne({
        email
      }).select('+passwordResetToken +passwordResetExpires')

      if (!user) {
        return res.status(400).json({ error: 'User not found' })
      }
      if (token !== user.passwordResetToken) {
        return res.status(400).json({ error: 'Token invalid' })
      }

      const now = new Date()

      if (now > user.passwordResetExpires) {
        return res.status(400).json({ error: 'Token expirou, gera um novo' })
      }
      user.password = password
      user.passwordResetToken = undefined
      user.passwordResetExpires = undefined

      await user.save()
      res.send({ message: 'Senha alterada com sucesso' })
    } catch (e) {
      res.status(400).json({ error: 'cannot reset password, try agian' })
    }
  })
  // liberando auth de outros modulos
  .post('/release', async (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' })
    }
    if (authHeader.split(' ').length !== 2) {
      return res.status(401).json({ error: 'Token error' })
    }
    if (!/^Bearer$/i.test(authHeader.split(' ')[0])) {
      return res.status(401).json({ error: 'Token malformatted' })
    }

    jwt.verify(authHeader.split(' ')[1], 'secret', (err, decoded) => {
      if (err) return res.status(301).json({ error: 'Token invalid' })
      return res.json(decoded)
    })
  })

app.listen('3000', () => {
  process.stdout.write('server listering in port 3000 \n')
})
