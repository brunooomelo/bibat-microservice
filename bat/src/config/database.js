const mongoose = require('mongoose')
const { bat } = require('../../../.config')

const URL = `mongodb://${bat.DBURL}/${bat.DBNAME}`
const options = {
  useNewUrlParser: true,
  reconnectTries: 60,
  reconnectInterval: 1000,
  poolSize: 150
}
let ping

mongoose.connect(
  URL,
  options
)

mongoose.connection.on('connected', () => {
  console.log('database is online')
  clearInterval(ping)
})
mongoose.connection.on('reconnected', () => {
  console.log('server reconnect to the database')
})
mongoose.connection.on('error', err => {
  console.log(`database error :: ${err.message}`)
})

mongoose.connection.on('disconnected', () => {
  console.log('database is disconnected')
  ping = setInterval(() => {
    switch (mongoose.connection.readyState) {
      case 0:
        console.log('database is offline')
        break
      case 1:
        console.log('database is online')
        break
    }
  }, 10000)
})

module.exports = mongoose
