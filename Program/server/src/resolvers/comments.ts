// Core
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";

// Service
import CommentService from "../service/CommentService/CommentService";

// Middleware
import {AuthMiddleware} from "../middleware/AuthMiddleware";

// Decorators
import {RightDecorator} from "../decorators/RightDecorator";

// Types
import {MyContext, OrganizationRights} from "../types";

// Models
import {Comment} from "../models/Comment";

// Args
import {
    CreateCommentInput,
    DeleteCommentInput,
    DeleteCommentResponse,
    UpdateCommentInput
} from "../service/CommentService/args";

@Resolver()
export class CommentResolver {
    @Mutation(() => Comment)
    @UseMiddleware(AuthMiddleware)
    async createComment(@Ctx() ctx: MyContext, @Arg('options') options: CreateCommentInput): Promise<Comment> {
        return CommentService.create(ctx, options);
    }

    @Mutation(() => Comment)
    @UseMiddleware(AuthMiddleware)
    async updateComment(@Arg('options') options: UpdateCommentInput): Promise<Comment> {
        return CommentService.update(options);
    }

    @Mutation(() => DeleteCommentResponse)
    @UseMiddleware(AuthMiddleware)
    async deleteComment(@Arg('options') options: DeleteCommentInput): Promise<DeleteCommentResponse> {
        return CommentService.delete(options);
    }
}