// Core
import express from 'express';
import cors from 'cors';
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";

// Config
import {corsConfig} from './init/config/corsConfig';
import {PORT} from './init/config/constants';

// Database
import {db} from './init/database';

// Server
import {app} from './init/server';

// Resolvers
import {UserResolver} from "./resolvers/user/user";

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

        const apolloServer: ApolloServer = new ApolloServer({
            schema: await buildSchema({
                resolvers: [UserResolver]
            }),
            context: () => ({})
        });
        await apolloServer.start();
        apolloServer.applyMiddleware({app});

        app.use(cors(corsConfig));
        // parse requests of content-type - application/json
        app.use(express.json());
        // parse requests of content-type - application/x-www-form-urlencoded
        app.use(express.urlencoded({extended: true}));

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (err) {
        console.error(err);
    }
};

start();
