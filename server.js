require('dotenv').config();

const { createApp } = require('./app');
const appDataSource = require('./models/dataSource');
const log = require('./config/logger');

const openServer = async () => {
  try {
    const app = createApp();

    await appDataSource.initialize();
    log.info('database has been initialized!');

    app.listen(process.env.PORT, () => {
      log.info(`server listening on ${process.env.PORT}`);
    });
  } catch (err) {
    log.error(err);
  }
};

openServer();
