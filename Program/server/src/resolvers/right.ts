// Core
import {Arg, Ctx, Query, Resolver, UseMiddleware} from "type-graphql";

// Models
import {Role} from "../models/Role";

// Types
import {MyContext, OrganizationRights} from "../types";

// Middleware
import {AuthMiddleware} from "../middleware/AuthMiddleware";

// Decorators
import {RightDecorator} from "../decorators/RightDecorator";

// Args
import {getDeskRolesInput, getOrganizationRolesInput} from "../service/RightService/args";

// Service
import RightService from "../service/RightService/RightService";

@Resolver()
export class RightResolver {
    @Query(() => [Role])
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.READ_ORGANIZATION_ROLES]})
    async organizationRoles(@Ctx() ctx: MyContext, @Arg('options') options: getOrganizationRolesInput): Promise<Role[] | null> {
        return RightService.getOrganizationRolesInput(ctx, options);
    }

    @Query(() => [Role])
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.READ_DESK_ROLES]})
    async deskRoles(@Ctx() ctx: MyContext, @Arg('options') options: getDeskRolesInput): Promise<Role[] | null> {
        return RightService.getDeskRolesInput(ctx, options);
    }
}
