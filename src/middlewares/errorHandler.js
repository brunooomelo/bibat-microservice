const logger = require('../services/logger');

module.exports = (err, req, res, next) => {
  logger.error(err, 'handle error catch');

  res.status(500).json({message: 'server error', error: 'ServerError'});
};
