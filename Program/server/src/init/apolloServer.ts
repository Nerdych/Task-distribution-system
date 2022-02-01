// Core
import NodeCache from "node-cache";
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";

// Types
import {MyContext} from "../types";
import {GraphQLError} from "graphql";

// Resolvers
import {UserResolver} from "../resolvers/user";
import {OrganizationResolver} from "../resolvers/organization";
import {DeskResolver} from "../resolvers/desk";
import {RolesResolver} from "../resolvers/role";
import {RightResolver} from "../resolvers/right";
import {LabelResolver} from "../resolvers/label";
import {EmployeeResolver} from "../resolvers/employee";

interface startApolloServerArgs {
    cache: NodeCache
}

const startApolloServer = async (contextArgs: startApolloServerArgs): Promise<ApolloServer> => {
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver, OrganizationResolver, DeskResolver, RolesResolver, RightResolver, LabelResolver, EmployeeResolver]
        }),
        context: ({req, res}: MyContext) => ({req, res, ...contextArgs}),
        formatError: (error: GraphQLError) => {
            return error;
        }
    });
    await apolloServer.start();
    return apolloServer;
}

export default startApolloServer;

