// Core
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";

// Models
import {User} from "../models/User";

// Types
import {RegisterInput, LoginInput, UserResponse, UserLoginResponse} from '../args/user/userArgs';

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
}
