const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const {environment} = require('./config/environment');
const logger = require('./services/logger');
const errorHandler = require('./middlewares/errorHandler');
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/api', routes);
app.use(errorHandler);

app.listen(environment.PORT, () =>
  logger.info(`server listering on PORT ${environment.PORT}`)
);
