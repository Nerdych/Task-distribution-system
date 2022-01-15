// Core
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";

// Models
import {User} from "../models/User";

// Types
import {
    RegisterInput,
    LoginInput,
    UserResponse,
    UserLoginResponse,
    ForgotPasswordInput,
    UserForgotPasswordResponse,
    UserChangePasswordResponse, ChangePasswordInput
} from '../args/user/userArgs';

// Service
import UserService from "../service/UserService";

// Types
import {MyContext} from "../types";

// Middleware
import {AuthMiddleware} from "../middleware/AuthMiddleware";

@Resolver()
export class UserResolver {
    @Query(() => User, {nullable: true})
    @UseMiddleware(AuthMiddleware)
    async me(): Promise<User | null> {
        return UserService.me();
    }

    @Mutation(() => UserResponse)
    async register(@Arg('options') options: RegisterInput): Promise<UserResponse> {
        return UserService.register(options);
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
}
