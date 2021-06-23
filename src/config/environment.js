const path = require('path');
require('dotenv');

const environment = {
  DATABASE_URL: process.env.DATABASE_URL,
  UPLOAD_PATH: path.join(__dirname, String(process.env.UPLOAD_PATH)),
  PORT: process.env.PORT || '3333',
  JWTSECRET: process.env.JWTSECRET || 's3cr3t0',
};

module.exports = {environment};
