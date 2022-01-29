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
    CreateOrganizationResponse, GetOrganizationInput, GetOrganizationResponse, UpdateOrganizationInput,
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
    async organization(@Ctx() ctx: MyContext, @Arg('options') options: GetOrganizationInput): Promise<GetOrganizationResponse> {
        return OrganizationService.getOrganization(ctx, options);
    }

    @Mutation(() => CreateOrganizationResponse)
    @UseMiddleware(AuthMiddleware)
    async createOrganization(@Ctx() ctx: MyContext, @Arg('options') options: CreateOrganizationInput): Promise<CreateOrganizationResponse> {
        return OrganizationService.create(ctx, options);
    }

    @Mutation(() => UpdateOrganizationResponse)
    @RightDecorator({organizationRights: [OrganizationRights.UPDATE_ORGANIZATION]})
    @UseMiddleware(AuthMiddleware)
    async updateOrganization(@Ctx() ctx: MyContext, @Arg('options') options: UpdateOrganizationInput): Promise<UpdateOrganizationResponse> {
        return OrganizationService.update(ctx, options);
    }
}
