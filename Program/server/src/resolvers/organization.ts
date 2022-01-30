// Core
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";

// Models
import {Organization} from "../models/Ogranization";

// Types
import {MyContext, OrganizationRights} from "../types";

// Service
import OrganizationService from "../service/OrganizationService/OrganizationService";

// Middleware
import {AuthMiddleware} from "../middleware/AuthMiddleware";

// Args
import {
    CreateOrganizationInput,
    CreateOrganizationResponse,
    DeleteOrganizationInput,
    DeleteOrganizationResponse,
    GetOrganizationInfoInput,
    GetOrganizationInput,
    GetOrganizationResponse,
    UpdateOrganizationInput,
    UpdateOrganizationResponse
} from "../service/OrganizationService/args";
import {RightDecorator} from "../decorators/RightDecorator";

@Resolver()
export class OrganizationResolver {
    @Query(() => [Organization], {nullable: true})
    @UseMiddleware(AuthMiddleware)
    async organizations(@Ctx() ctx: MyContext): Promise<Organization[] | null> {
        return OrganizationService.getUserOrganizations(ctx);
    }

    @Query(() => Organization, {nullable: true})
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({})
    async organization(@Ctx() ctx: MyContext, @Arg('options') options: GetOrganizationInput): Promise<GetOrganizationResponse> {
        return OrganizationService.getOrganization(ctx, options);
    }

    @Query(() => Organization, {nullable: true})
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.READ_ORGANIZATION_INFO]})
    async organizationInfo(@Ctx() ctx: MyContext, @Arg('options') options: GetOrganizationInfoInput): Promise<Organization> {
        return OrganizationService.getOrganizationInfo(ctx, options);
    }

    @Mutation(() => CreateOrganizationResponse)
    @UseMiddleware(AuthMiddleware)
    async createOrganization(@Ctx() ctx: MyContext, @Arg('options') options: CreateOrganizationInput): Promise<CreateOrganizationResponse> {
        return OrganizationService.create(ctx, options);
    }

    @Mutation(() => UpdateOrganizationResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.UPDATE_ORGANIZATION]})
    async updateOrganization(@Ctx() ctx: MyContext, @Arg('options') options: UpdateOrganizationInput): Promise<UpdateOrganizationResponse> {
        return OrganizationService.update(options);
    }

    @Mutation(() => DeleteOrganizationResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.DELETE_ORGANIZATION]})
    async deleteOrganization(@Ctx() ctx: MyContext, @Arg('options') options: DeleteOrganizationInput): Promise<DeleteOrganizationResponse> {
        return OrganizationService.delete(options);
    }
}
