// Core
import express, {Application} from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import {ApolloServer} from "apollo-server-express";
import dotenv from 'dotenv';

dotenv.config();

// Config
import {corsConfig} from './init/config/corsConfig';
import {PORT} from './init/config/constants';

// Database
import {db} from './init/database';

// Server
import startExpressServer from './init/expressServer';
import startApolloServer from "./init/apolloServer";
import {addEndpoints} from "./init/addEndpoints";

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

        const app: Application = startExpressServer();
        const apolloServer: ApolloServer = await startApolloServer();

        apolloServer.applyMiddleware({
            app,
            cors: {
                origin: 'https://studio.apollographql.com',
                credentials: true,
            }
        });

        app.use(cookieParser());
        app.use(cors(corsConfig));
        app.use(express.json());

        addEndpoints(app);

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (err) {
        console.error(err);
    }
};

start();
