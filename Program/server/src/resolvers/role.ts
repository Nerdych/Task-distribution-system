// Core
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";

// Models
import {Role} from "../models/Role";

// Types
import {MyContext, OrganizationRights, PurposeTypes} from "../types";

// Middleware
import {AuthMiddleware} from "../middleware/AuthMiddleware";

// Decorators
import {RightDecorator} from "../decorators/RightDecorator";

// Args
import {
    CreateRoleInput,
    CreateRoleResponse, DeleteRoleInput, DeleteRoleResponse,
    GetDeskRolesInput,
    GetOrganizationRolesInput, UpdateRoleInput, UpdateRoleResponse
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

    @Mutation(() => CreateRoleResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.CREATE_ORGANIZATION_ROLE]})
    async createOrganizationRole(@Ctx() ctx: MyContext, @Arg('options') options: CreateRoleInput): Promise<CreateRoleResponse> {
        return RolesService.create({...options, purposeId: PurposeTypes.organization});
    }

    @Mutation(() => CreateRoleResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.CREATE_DESK_ROLE]})
    async createDeskRole(@Ctx() ctx: MyContext, @Arg('options') options: CreateRoleInput): Promise<CreateRoleResponse> {
        return RolesService.create({...options, purposeId: PurposeTypes.desk});
    }

    @Mutation(() => UpdateRoleResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.UPDATE_ORGANIZATION_ROLE]})
    async updateOrganizationRole(@Ctx() ctx: MyContext, @Arg('options') options: UpdateRoleInput): Promise<UpdateRoleResponse> {
        return RolesService.update({...options, purposeId: PurposeTypes.organization});
    }

    @Mutation(() => UpdateRoleResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.UPDATE_DESK_ROLE]})
    async updateDeskRole(@Ctx() ctx: MyContext, @Arg('options') options: UpdateRoleInput): Promise<UpdateRoleResponse> {
        return RolesService.update({...options, purposeId: PurposeTypes.desk});
    }

    @Mutation(() => DeleteRoleResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.DELETE_ORGANIZATION_ROLE]})
    async deleteDeskRole(@Ctx() ctx: MyContext, @Arg('options') options: DeleteRoleInput): Promise<DeleteRoleResponse> {
        return RolesService.delete(options);
    }

    @Mutation(() => DeleteRoleResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.DELETE_DESK_ROLE]})
    async deleteOrganizationRole(@Ctx() ctx: MyContext, @Arg('options') options: DeleteRoleInput): Promise<DeleteRoleResponse> {
        return RolesService.delete(options);
    }
}
