const jwt = require('jsonwebtoken')
const { JWTSECRET } = require('../../../.config')

module.exports = (req, res, next) => {
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

  jwt.verify(authHeader.split(' ')[1], JWTSECRET, (err, decoded) => {
    if (err) return res.status(301).json({ error: 'Token invalid' })
    req.tokenAuth = decoded
    return next()
  })
}
