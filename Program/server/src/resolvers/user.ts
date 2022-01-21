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
import {MyContext} from "../types";

// Middleware
import {AuthMiddleware} from "../middleware/AuthMiddleware";

@Resolver()
export class UserResolver {
    @Query(() => User, {nullable: true})
    @UseMiddleware(AuthMiddleware)
    async me(@Ctx() ctx: MyContext): Promise<User | null> {
        return UserService.me(ctx);
    }

    @Mutation(() => UserRegisterResponse)
    async register(@Ctx() ctx: MyContext, @Arg('options') options: RegisterInput): Promise<UserRegisterResponse> {
        return UserService.register(options, ctx);
    }

    @Mutation(() => UserLoginResponse)
    async login(@Ctx() ctx: MyContext, @Arg('options') options: LoginInput): Promise<UserLoginResponse> {
        return UserService.login(options, ctx);
    }

    @Mutation(() => UserForgotPasswordResponse)
    async forgotPassword(@Ctx() ctx: MyContext, @Arg('options') options: ForgotPasswordInput): Promise<UserForgotPasswordResponse> {
        return UserService.forgotPassword(options, ctx);
    }

    @Mutation(() => UserChangePasswordResponse)
    async changePassword(@Ctx() ctx: MyContext, @Arg('options') options: ChangePasswordInput): Promise<UserChangePasswordResponse> {
        return UserService.changePassword(options, ctx);
    }

    @Mutation(() => UserConfirmAccountResponse)
    async confirmAccount(@Ctx() ctx: MyContext, @Arg('options') options: ConfirmAccountInput): Promise<UserConfirmAccountResponse> {
        return UserService.confirmAccount(options, ctx);
    }
}
