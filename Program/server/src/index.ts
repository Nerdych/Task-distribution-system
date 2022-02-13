// Core
import express, {Application} from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import NodeCache from 'node-cache';
import dotenv from 'dotenv';
import path from "path";
import {ApolloServer} from "apollo-server-express";
import {Server} from "http";
import {SubscriptionServer} from "subscriptions-transport-ws";
import {GraphQLSchema} from "graphql";

dotenv.config();

// Config
import {corsConfig} from './init/config/corsConfig';
import {PORT} from './init/config/constants';

// Database
import {db} from './init/database';

// Server
import startExpressServer from './init/expressServer';
import startApolloServer from "./init/apolloServer";
import {startSubscribtionsServer} from "./init/subscriptionsServer";
import {startHttpServer} from "./init/httpServer";
import {addEndpoints} from "./init/addEndpoints";
import {createSchema} from "./init/createSchema";
import {graphqlUploadExpress} from "graphql-upload";


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

        const schema: GraphQLSchema = await createSchema();
        const nodeCache: NodeCache = new NodeCache();

        const app: Application = startExpressServer();
        const httpServer: Server = startHttpServer({app});
        const subscriptionServer: SubscriptionServer = startSubscribtionsServer({schema, httpServer});
        const apolloServer: ApolloServer = await startApolloServer({
            contextArgs: {cache: nodeCache},
            subscriptionServer,
            schema
        });

        app.use(graphqlUploadExpress());
        app.use(cookieParser());
        app.use(cors(corsConfig));
        app.use(express.json());
        app.use(express.static(path.join(__dirname, 'static')));

        apolloServer.applyMiddleware({
            app,
            cors: {
                origin: 'https://studio.apollographql.com',
                credentials: true,
            }
        });

        addEndpoints(app);

        httpServer.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (err) {
        console.error(err);
    }
};

start();
