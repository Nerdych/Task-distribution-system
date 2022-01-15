// Core
import NodeCache from "node-cache";
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";

// Resolvers
import {UserResolver} from "../resolvers/user";

// Types
import {MyContext} from "../types";

interface startApolloServerArgs {
    cache: NodeCache
}

const startApolloServer = async (contextArgs: startApolloServerArgs): Promise<ApolloServer> => {
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver]
        }),
        context: ({req, res}: MyContext) => ({req, res, ...contextArgs}),
    });
    await apolloServer.start();
    return apolloServer;
}

export default startApolloServer;

