const nodemail = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

const transport = nodemail.createTransport()

transport.use(
  'compile',
  hbs({
    viewEngine: 'handlebars',
    viewPath: path.resolve('./src/services/mailer'),
    extName: '.html'
  })
)

module.exports = transport
