// Core
import dotenv from 'dotenv';
import { CorsOptions } from 'cors';
import { Dialect, PoolOptions, Sequelize } from 'sequelize/dist';

dotenv.config();

export const PORT = process.env.PORT || 4000;

export const __prod__: boolean = process.env.NODE_ENV === 'production';

export const corsOptions: CorsOptions = { origin: 'http://localhost:3000' };

type dbConfigType = {
	HOST: string;
	USERNAME: string;
	PASSWORD: string | undefined;
	DB: string;
	PORT: number;
	dialect: Dialect;
	pool: PoolOptions;
};

export const dbConfig: dbConfigType = {
	HOST: 'localhost',
	USERNAME: 'postgres',
	PASSWORD: 'xeljrjn666',
	DB: 'task_distribution_system',
	PORT: 6000,
	dialect: 'postgres',
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
};
