// Core
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";

// Models
import {Organization} from "../models/Ogranization";

// Types
import {MyContext} from "../types";

// Service
import OrganizationService from "../service/OrganizationService/OrganizationService";

// Middleware
import {AuthMiddleware} from "../middleware/AuthMiddleware";

// Args
import {CreateOrganizationInput, CreateOrganizationResponse} from "../service/OrganizationService/args";

@Resolver()
export class OrganizationResolver {
    @Query(() => [Organization], {nullable: true})
    @UseMiddleware(AuthMiddleware)
    async organizations(@Ctx() ctx: MyContext): Promise<Organization[] | null> {
        return await OrganizationService.getUserOrganizations(ctx);
    }

    @Mutation(() => CreateOrganizationResponse)
    @UseMiddleware(AuthMiddleware)
    async createOrganization(@Arg('options') options: CreateOrganizationInput, @Ctx() ctx: MyContext): Promise<CreateOrganizationResponse> {
        return OrganizationService.create(options, ctx);
    }
}
