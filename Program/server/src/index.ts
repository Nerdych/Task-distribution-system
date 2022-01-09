// Core
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Config
import {corsConfig} from './init/config/corsConfig';
import {PORT} from './init/config/constants';

// Database
import {db} from './init/database';

// Server
import startExpressServer from './init/server';
import startApolloServer from "./init/apolloServer";

const start = async () => {
    try {
        await db
            .authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });

        const apolloServer = await startApolloServer();
        const app = startExpressServer();

        apolloServer.applyMiddleware({app});

        app.use(cors(corsConfig));
        app.use(express.json());

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (err) {
        console.error(err);
    }
};

start();
