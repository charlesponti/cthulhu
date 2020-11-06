/**
 * This file is to be used when the database must be reinitialised.
 */
import * as dotenv from 'dotenv';
import logger from '../logger';

dotenv.config();

const {sequelize} = require('./index');

async function syncDatabase() {
  try {
    logger.info('🚜 Beginning database sync...');
    await sequelize.sync({force: true});
    logger.info('✅ Completed database sync!');
    process.exit(0) // eslint-disable-line
  } catch (e) {
    logger.error(e.message);
    process.exit(0) // eslint-disable-line
  }
}

syncDatabase();
