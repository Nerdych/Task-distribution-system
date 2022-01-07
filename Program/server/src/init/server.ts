// Core
import express, { Application } from 'express';
import { ApolloServer, ExpressContext } from 'apollo-server-express';

// Schema
import { schema } from './schema';

// Resolvers
import { resolvers } from './resolvers';

const app: Application = express();
const apolloServer: ApolloServer<ExpressContext> = new ApolloServer({ typeDefs: schema, resolvers });

export { app, apolloServer };
