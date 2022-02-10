// Core
import {SubscriptionServer} from "subscriptions-transport-ws";
import {execute, GraphQLSchema, subscribe} from "graphql";
import {Server} from "http";

interface startSubscribtionsServerArgs {
    schema: GraphQLSchema;
    httpServer: Server
}

export const startSubscribtionsServer = ({schema, httpServer}: startSubscribtionsServerArgs): SubscriptionServer => {
    return SubscriptionServer.create({
        schema,
        execute,
        subscribe,
    }, {server: httpServer, path: '/graphql'});
}