// Core
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";

// Models
import {Desk} from "../models/Desk";

// Types
import {DesksRights, MyContext, OrganizationRights} from "../types";

// Service
import DeskService from "../service/DeskService/DeskService";
import MessageService from "../service/MessageService/MessageService";
import ColumnService from "../service/ColumnService/ColumnService";

// Middleware
import {AuthMiddleware} from "../middleware/AuthMiddleware";

// Args
import {
    AddUserDeskInput,
    AddUserDeskResponse, ChangeEmployeeRolesInput, ChangeEmployeeRolesResponse,
    CreateDeskInput,
    CreateDeskResponse,
    DeleteDeskInput,
    DeleteDeskResponse,
    GetDeskEmployeesInput,
    GetDeskInput,
    GetDesksInput,
    InviteDeskInput,
    InviteDeskResponse,
    UpdateDeskInput
} from "../service/DeskService/args";

// Decorators
import {RightDecorator} from "../decorators/RightDecorator";

// Args
import {
    DeleteMessageInput,
    DeleteMessageResponse,
    SendMessageInput,
    SendMessageResponse,
    UpdateMessageInput,
    UpdateMessageResponse
} from "../service/MessageService/args";
import {
    CreateColumnInput,
    CreateColumnResponse,
    DeleteColumnInput,
    DeleteColumnResponse,
    UpdateColumnInput,
    UpdateColumnResponse
} from "../service/ColumnService/args";
import {UserDesk} from "../models/UserDesk";

@Resolver()
export class DeskResolver {
    @Query(() => [Desk], {nullable: true})
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.READ_DESK]})
    async desks(@Ctx() ctx: MyContext, @Arg('options') options: GetDesksInput): Promise<Desk[] | null> {
        return DeskService.getDesks(ctx, options);
    }

    @Query(() => Desk, {nullable: true})
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.READ_DESK]})
    async desk(@Arg('options') options: GetDeskInput): Promise<Desk | null> {
        return DeskService.getDesk(options);
    }

    @Query(() => [UserDesk], {nullable: true})
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({deskRights: [DesksRights.READ_DESK_EMPLOYEES]})
    async deskEmployees(@Ctx() ctx: MyContext, @Arg('options') options: GetDeskEmployeesInput): Promise<UserDesk[]> {
        return DeskService.getDeskEmployees(ctx, options);
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
    @RightDecorator({organizationRights: [OrganizationRights.CREATE_DESK]})
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

    @Mutation(() => ChangeEmployeeRolesResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({deskRights: [DesksRights.CHANGE_DESK_ROLES]})
    async changeDeskEmployeeRolesUser(@Ctx() ctx: MyContext, @Arg('options') options: ChangeEmployeeRolesInput): Promise<ChangeEmployeeRolesResponse> {
        return DeskService.changeRoles(ctx, options);
    }

    @Mutation(() => SendMessageResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({deskRights: [DesksRights.USE_CHAT]})
    async sendMessage(@Ctx() ctx: MyContext, @Arg('options') options: SendMessageInput): Promise<SendMessageResponse> {
        return MessageService.send(ctx, options);
    }

    @Mutation(() => UpdateMessageResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({deskRights: [DesksRights.USE_CHAT]})
    async updateMessage(@Ctx() ctx: MyContext, @Arg('options') options: UpdateMessageInput): Promise<UpdateMessageResponse> {
        return MessageService.update(ctx, options);
    }

    @Mutation(() => DeleteMessageResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({deskRights: [DesksRights.USE_CHAT]})
    async deleteMessage(@Ctx() ctx: MyContext, @Arg('options') options: DeleteMessageInput): Promise<DeleteMessageResponse> {
        return MessageService.delete(ctx, options);
    }

    @Mutation(() => CreateColumnResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({deskRights: [DesksRights.CREATE_COLUMN]})
    async createColumn(@Arg('options') options: CreateColumnInput): Promise<CreateColumnResponse> {
        return ColumnService.create(options);
    }

    @Mutation(() => UpdateColumnResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({deskRights: [DesksRights.UPDATE_COLUMN]})
    async updateColumn(@Arg('options') options: UpdateColumnInput): Promise<UpdateColumnResponse> {
        return ColumnService.update(options);
    }

    @Mutation(() => DeleteColumnResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({deskRights: [DesksRights.DELETE_COLUMN]})
    async deleteColumn(@Arg('options') options: DeleteColumnInput): Promise<DeleteColumnResponse> {
        return ColumnService.delete(options);
    }
}
