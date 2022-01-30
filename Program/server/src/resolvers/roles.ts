// Core
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";

// Models
import {Role} from "../models/Role";

// Types
import {MyContext, OrganizationRights} from "../types";

// Middleware
import {AuthMiddleware} from "../middleware/AuthMiddleware";

// Decorators
import {RightDecorator} from "../decorators/RightDecorator";

// Args
import {
    GetDeskRolesInput,
    GetOrganizationRolesInput,
    UpdateRoleInput,
    UpdateRolesResponse
} from "../service/RolesService/args";

// Service
import RolesService from "../service/RolesService/RolesService";

@Resolver()
export class RolesResolver {
    @Query(() => [Role])
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.READ_ORGANIZATION_ROLES]})
    async organizationRoles(@Ctx() ctx: MyContext, @Arg('options') options: GetOrganizationRolesInput): Promise<Role[] | null> {
        return RolesService.getOrganizationRoles(ctx, options);
    }

    @Query(() => [Role])
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.READ_DESK_ROLES]})
    async deskRoles(@Ctx() ctx: MyContext, @Arg('options') options: GetDeskRolesInput): Promise<Role[] | null> {
        return RolesService.getDeskRoles(ctx, options);
    }

    @Mutation(() => UpdateRolesResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.UPDATE_ORGANIZATION_ROLE]})
    async updateRole(@Ctx() ctx: MyContext, @Arg('options') options: UpdateRoleInput): Promise<UpdateRolesResponse> {
        return RolesService.update(options);
    }
}
