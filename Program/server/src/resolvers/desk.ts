// Core
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";

// Models
import {Desk} from "../models/Desk";

// Types
import {DesksRights, MyContext, OrganizationRights} from "../types";

// Service
import DeskService from "../service/DeskService/DeskService";

// Middleware
import {AuthMiddleware} from "../middleware/AuthMiddleware";

// Args
import {
    AddUserDeskInput,
    AddUserDeskResponse,
    CreateDeskInput,
    CreateDeskResponse,
    DeleteDeskInput, DeleteDeskResponse,
    GetDeskInput,
    GetDesksInput, InviteDeskInput, InviteDeskResponse, UpdateDeskInput
} from "../service/DeskService/args";

// Decorators
import {RightDecorator} from "../decorators/RightDecorator";

@Resolver()
export class DeskResolver {
    @Query(() => [Desk], {nullable: true})
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.READ_DESK]})
    async desks(@Ctx() ctx: MyContext, @Arg('options') options: GetDesksInput): Promise<Desk[] | null> {
        return DeskService.getDesks(ctx, options);
    }

    @Mutation(() => Desk, {nullable: true})
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.READ_DESK]})
    async desk(@Arg('options') options: GetDeskInput): Promise<Desk | null> {
        return DeskService.getDesk(options);
    }

    @Mutation(() => DeleteDeskResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.DELETE_DESK]})
    async deleteDesk(@Arg('options') options: DeleteDeskInput): Promise<DeleteDeskResponse> {
        return DeskService.delete(options);
    }

    @Mutation(() => Desk)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.UPDATE_DESK]})
    async updateDesk(@Arg('options') options: UpdateDeskInput): Promise<Desk> {
        return DeskService.update(options);
    }

    @Mutation(() => CreateDeskResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.READ_DESK], deskRights: [DesksRights.READ_ROLES_ON_DESK]})
    async createDesk(@Ctx() ctx: MyContext, @Arg('options') options: CreateDeskInput): Promise<CreateDeskResponse> {
        return DeskService.create(ctx, options);
    }

    @Mutation(() => InviteDeskResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({deskRights: [DesksRights.INVITE_USER_ON_DESK]})
    async inviteUser(@Ctx() ctx: MyContext, @Arg('options') options: InviteDeskInput): Promise<InviteDeskResponse> {
        return DeskService.invite(ctx, options);
    }

    @Mutation(() => AddUserDeskResponse)
    @UseMiddleware(AuthMiddleware)
    async addUser(@Ctx() ctx: MyContext, @Arg('options') options: AddUserDeskInput): Promise<AddUserDeskResponse> {
        return DeskService.addUser(ctx, options);
    }
}
