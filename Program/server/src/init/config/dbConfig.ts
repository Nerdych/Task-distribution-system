// Core
import {Dialect, PoolOptions} from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

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
    HOST: process.env.HOST || 'localhost',
    USERNAME: process.env.USERDB || 'postgres',
    PASSWORD: process.env.PASSWORD || 'xeljrjn666',
    DB: process.env.DB || 'task_distribution_system',
    PORT: Number(process.env.PORT_DB) || 6000,
    dialect: (process.env.DIALECT as Dialect) || 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
