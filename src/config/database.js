const mongoose = require('mongoose');

const connectToDatabase = () => mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 2000,
  socketTimeoutMS: 2000,
});

module.exports = connectToDatabase;
