const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const yaml = require('yamljs');

const routes = require('./routes/index');
const openAPIDocument = yaml.load('./documents/openapi.yaml');
const logger = require('./config/logger');

const morganFormat = process.env.NODE_ENV !== 'production' ? 'dev' : 'combined';

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(morgan(morganFormat, { stream: logger.stream }));
  app.use(cors());
  app.use(routes);
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openAPIDocument));
  app.get('/ping', (req, res) => {
    return res.json({ message: 'pong' });
  });
  return app;
};

module.exports = {
  createApp,
};
