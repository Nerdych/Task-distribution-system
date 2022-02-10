// Core
import {Arg, Ctx, Mutation, Resolver, UseMiddleware} from "type-graphql";

// Middleware
import {AuthMiddleware} from "../middleware/AuthMiddleware";

// Decorators
import {RightDecorator} from "../decorators/RightDecorator";

// Types
import {DesksRights, MyContext} from "../types";

// Service
import CommentService from "../service/CommentService/CommentService";

// Args
import {
    CreateCommentInput,
    DeleteCommentInput,
    DeleteCommentResponse,
    UpdateCommentInput
} from "../service/CommentService/args";

// Models
import {Comment} from "../models/Comment";

@Resolver()
export class CommentResolver {
    @Mutation(() => Comment)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({deskRights: [DesksRights.USE_COMMENT]})
    async createComment(@Ctx() ctx: MyContext, @Arg('options') options: CreateCommentInput): Promise<Comment> {
        return CommentService.create(ctx, options);
    }

    @Mutation(() => Comment)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({deskRights: [DesksRights.USE_COMMENT]})
    async updateComment(@Ctx() ctx: MyContext, @Arg('options') options: UpdateCommentInput): Promise<Comment> {
        return CommentService.update(options);
    }

    @Mutation(() => DeleteCommentResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({deskRights: [DesksRights.USE_COMMENT]})
    async deleteComment(@Ctx() ctx: MyContext, @Arg('options') options: DeleteCommentInput): Promise<DeleteCommentResponse> {
        return CommentService.delete(options);
    }
}