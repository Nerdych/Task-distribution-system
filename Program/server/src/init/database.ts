// Core
import { Sequelize } from 'sequelize';

// Config Database
import { dbConfig } from './config';

export const db: Sequelize = new Sequelize(dbConfig.DB, dbConfig.USERNAME, dbConfig.PASSWORD, {
	host: dbConfig.HOST,
	port: dbConfig.PORT,
	dialect: dbConfig.dialect,
	pool: dbConfig.pool,
});
