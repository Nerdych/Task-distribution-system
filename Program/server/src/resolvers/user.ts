// Core
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";

// Models
import {User} from "../models/User";

// Types
import {
    ChangePasswordInput,
    ConfirmAccountInput,
    ForgotPasswordInput,
    LoginInput,
    RegisterInput,
    UserChangePasswordResponse,
    UserConfirmAccountResponse,
    UserForgotPasswordResponse,
    UserLoginResponse,
    UserRegisterResponse
} from '../service/UserService/args';

// Service
import UserService from "../service/UserService/UserService";

// Types
import {MyContext, OrganizationRights} from "../types";

// Middleware
import {AuthMiddleware} from "../middleware/AuthMiddleware";
import {RightDecorator} from "../decorators/RightDecorator";

@Resolver()
export class UserResolver {
    @Query(() => User, {nullable: true})
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizations: {id: 1, rights: [OrganizationRights.getAllDesks]}})
    async me(@Ctx() ctx: MyContext): Promise<User | null> {
        return UserService.me(ctx);
    }

    @Mutation(() => UserRegisterResponse)
    async register(@Arg('options') options: RegisterInput, @Ctx() ctx: MyContext): Promise<UserRegisterResponse> {
        return UserService.register(options, ctx);
    }

    @Mutation(() => UserLoginResponse)
    async login(@Arg('options') options: LoginInput, @Ctx() ctx: MyContext): Promise<UserLoginResponse> {
        return UserService.login(options, ctx);
    }

    @Mutation(() => UserForgotPasswordResponse)
    async forgotPassword(@Arg('options') options: ForgotPasswordInput, @Ctx() ctx: MyContext): Promise<UserForgotPasswordResponse> {
        return UserService.forgotPassword(options, ctx);
    }

    @Mutation(() => UserChangePasswordResponse)
    async changePassword(@Arg('options') options: ChangePasswordInput, @Ctx() ctx: MyContext): Promise<UserChangePasswordResponse> {
        return UserService.changePassword(options, ctx);
    }

    @Mutation(() => UserConfirmAccountResponse)
    async confirmAccount(@Arg('options') options: ConfirmAccountInput, @Ctx() ctx: MyContext): Promise<UserConfirmAccountResponse> {
        return UserService.confirmAccount(options, ctx);
    }
}
