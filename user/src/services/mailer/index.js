const nodemail = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const path = require('path')
const config = require('../../../.config.json')

const transport = nodemail.createTransport(config)

transport.use(
  'compile',
  hbs({
    viewEngine: 'handlebars',
    viewPath: path.resolve('./src/services/mailer'),
    extName: '.html'
  })
)

module.exports = transport
