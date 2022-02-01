// Core
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";

// Models
import {Label} from "../models/Label";

// Types
import {MyContext, OrganizationRights} from "../types";

// Decorators
import {RightDecorator} from "../decorators/RightDecorator";

// Service
import LabelService from "../service/LabelService/LabelService";

// Middleware
import {AuthMiddleware} from "../middleware/AuthMiddleware";

// Args
import {
    CreateLabelInput,
    CreateLabelResponse, DeleteLabelInput, DeleteLabelResponse,
    GetAllLabelsInput,
    UpdateLabelInput,
    UpdateLabelResponse
} from "../service/LabelService/args";

@Resolver()
export class LabelResolver {
    @Query(() => [Label])
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.READ_LABELS]})
    async labels(@Ctx() ctx: MyContext, @Arg('options') options: GetAllLabelsInput): Promise<Label[]> {
        return await LabelService.getAll(options);
    }

    @Mutation(() => CreateLabelResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.CREATE_LABEL]})
    async createLabel(@Ctx() ctx: MyContext, @Arg('options') options: CreateLabelInput): Promise<CreateLabelResponse> {
        return await LabelService.create(options);
    }

    @Mutation(() => UpdateLabelResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.UPDATE_LABEL]})
    async updateLabel(@Ctx() ctx: MyContext, @Arg('options') options: UpdateLabelInput): Promise<UpdateLabelResponse> {
        return await LabelService.update(options);
    }

    @Mutation(() => DeleteLabelResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.DELETE_LABEL]})
    async deleteLabel(@Ctx() ctx: MyContext, @Arg('options') options: DeleteLabelInput): Promise<DeleteLabelResponse> {
        return await LabelService.delete(options);
    }
}
