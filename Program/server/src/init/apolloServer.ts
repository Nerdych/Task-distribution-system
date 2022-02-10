// Core
import NodeCache from "node-cache";
import {ApolloServer} from "apollo-server-express";
import {GraphQLError, GraphQLSchema} from "graphql";
import {SubscriptionServer} from "subscriptions-transport-ws";

// Types
import {MyContext} from "../types";

interface startApolloServerArgs {
    contextArgs: {
        cache: NodeCache
    };
    subscriptionServer: SubscriptionServer;
    schema: GraphQLSchema;
}

const startApolloServer = async ({contextArgs, subscriptionServer, schema}: startApolloServerArgs): Promise<ApolloServer> => {
    const apolloServer: ApolloServer = new ApolloServer({
        schema: schema,
        context: ({req, res}: MyContext) => ({req, res, ...contextArgs}),
        formatError: (error: GraphQLError) => {
            return error;
        },
        plugins: [{
            async serverWillStart() {
                return {
                    async drainServer() {
                        subscriptionServer.close();
                    }
                };
            }
        }],
    });
    await apolloServer.start();
    return apolloServer;
}

export default startApolloServer;

