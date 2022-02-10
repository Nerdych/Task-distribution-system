// Core
import {Arg, Ctx, Mutation, Resolver, UseMiddleware} from "type-graphql";

// Middleware
import {AuthMiddleware} from "../middleware/AuthMiddleware";

// Decorators
import {RightDecorator} from "../decorators/RightDecorator";

// Types
import {DesksRights, MyContext} from "../types";

// Service
import ListService from "../service/ListService/ListService";

// Args
import {CreateListInput, DeleteListInput, DeleteListResponse, UpdateListInput} from "../service/ListService/args";

// Models
import {List} from "../models/List";

@Resolver()
export class ListResolver {
    @Mutation(() => List)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({deskRights: [DesksRights.CREATE_LIST]})
    async createList(@Ctx() ctx: MyContext, @Arg('options') options: CreateListInput): Promise<List> {
        return ListService.create(options);
    }

    @Mutation(() => List)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({deskRights: [DesksRights.UPDATE_LIST]})
    async updateList(@Ctx() ctx: MyContext, @Arg('options') options: UpdateListInput): Promise<List> {
        return ListService.update(options);
    }

    @Mutation(() => DeleteListResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({deskRights: [DesksRights.DELETE_LIST]})
    async deleteList(@Ctx() ctx: MyContext, @Arg('options') options: DeleteListInput): Promise<DeleteListResponse> {
        return ListService.delete(options);
    }
}