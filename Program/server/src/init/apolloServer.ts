import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import {UserResolver} from "../resolvers/user/user";

const startApolloServer = async (): Promise<ApolloServer> => {
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver]
        }),
        context: () => ({})
    });
    await apolloServer.start();
    return apolloServer;
}

export default startApolloServer;

