// Core
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";

// Models
import {Desk} from "../models/Desk";

// Types
import {MyContext, OrganizationRights} from "../types";

// Service
import DeskService from "../service/DeskService/DeskService";

// Middleware
import {AuthMiddleware} from "../middleware/AuthMiddleware";

// Args
import {CreateDeskInput, CreateDeskResponse, GetDeskInput} from "../service/DeskService/args";

// Decorators
import {RightDecorator} from "../decorators/RightDecorator";

@Resolver()
export class DeskResolver {
    @Query(() => [Desk], {nullable: true})
    @UseMiddleware(AuthMiddleware)
    async desks(@Ctx() ctx: MyContext): Promise<Desk[] | null> {
        return await DeskService.getUserDesks(ctx);
    }

    @Mutation(() => CreateDeskResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.UPDATE_NAME_DESK]})
    async createDesk(@Ctx() ctx: MyContext, @Arg('options') options: CreateDeskInput): Promise<CreateDeskResponse> {
        return DeskService.create(ctx, options);
    }

    @Mutation(() => Desk, {nullable: true})
    @UseMiddleware(AuthMiddleware)
    async desk(@Ctx() ctx: MyContext, @Arg('options') options: GetDeskInput): Promise<Desk | null> {
        return DeskService.getById(ctx, options);
    }
}
