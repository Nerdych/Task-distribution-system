// Core
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";

// Resolvers
import {UserResolver} from "../resolvers/user";

// Types
import {MyContext} from "../types";

const startApolloServer = async (): Promise<ApolloServer> => {
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver]
        }),
        context: ({req, res}: MyContext) => ({req, res}),
    });
    await apolloServer.start();
    return apolloServer;
}

export default startApolloServer;

