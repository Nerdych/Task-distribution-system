// Core
import {Dialect} from 'sequelize';
import {SequelizeOptions} from 'sequelize-typescript';

export const dbConfig: SequelizeOptions = {
    host: process.env.POSTGRESS_HOST,
    username: process.env.POSTGRESS_USERNAME,
    password: process.env.POSTGRESS_PASSWORD,
    database: process.env.POSTGRESS_DB,
    port: Number(process.env.POSTGRESS_PORT),
    dialect: process.env.POSTGRESS_DIALECT as Dialect,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
