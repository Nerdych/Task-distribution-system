// Core
import {buildSchema} from "type-graphql";
import {GraphQLSchema} from "graphql";

// Resolvers
import {UserResolver} from "../resolvers/user";
import {OrganizationResolver} from "../resolvers/organization";
import {DeskResolver} from "../resolvers/desk";
import {RolesResolver} from "../resolvers/role";
import {RightResolver} from "../resolvers/right";
import {LabelResolver} from "../resolvers/label";
import {EmployeeResolver} from "../resolvers/employee";
import {CardResolver} from "../resolvers/card";
import {ListResolver} from "../resolvers/list";
import {CommentResolver} from "../resolvers/comments";

// Middleware
import {LogTimeMiddleware} from "../middleware/LogTimeMiddleware";
import {TaskResolver} from "../resolvers/task";

export const createSchema = async (): Promise<GraphQLSchema> => {
    return await buildSchema({
        resolvers: [UserResolver, OrganizationResolver, DeskResolver, RolesResolver, RightResolver,
            LabelResolver, EmployeeResolver, CardResolver, ListResolver, CommentResolver, TaskResolver],
        globalMiddlewares: [LogTimeMiddleware]
    });
}