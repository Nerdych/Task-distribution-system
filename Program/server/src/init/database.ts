// Core
import { Sequelize } from 'sequelize-typescript';

// Config Database
import { dbConfig } from './config';

// Models
import { Desk } from '../models/Desk';
import { Organization } from '../models/Ogranization';
import { User } from '../models/User';
import { ColumnTable } from '../models/Column';
import { Card } from '../models/Card';

export const db: Sequelize = new Sequelize({
	database: dbConfig.DB,
	username: dbConfig.USERNAME,
	password: dbConfig.PASSWORD,
	host: dbConfig.HOST,
	port: dbConfig.PORT,
	dialect: dbConfig.dialect,
	pool: dbConfig.pool,
	models: [User, Organization, Desk, ColumnTable, Card],
});
