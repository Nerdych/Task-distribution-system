// Core
import {Arg, Ctx, Query, Resolver, UseMiddleware} from "type-graphql";

// Middleware
import {AuthMiddleware} from "../middleware/AuthMiddleware";

// Types
import {MyContext} from "../types";

// Service
import RightService from "../service/RightService/RightService";

// Args
import {GetAllRightsByObjectInput, ObjectData} from "../service/RightService/args";

@Resolver()
export class RightResolver {
    @Query(() => [ObjectData])
    @UseMiddleware(AuthMiddleware)
    async rightsByObject(@Ctx() ctx: MyContext, @Arg('options') options: GetAllRightsByObjectInput): Promise<ObjectData[]> {
        return RightService.getAllRightsByObject(options);
    }
}
