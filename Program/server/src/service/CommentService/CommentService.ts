// Core
import {ApolloError} from "apollo-server-express";

// Args
import {CreateCommentInput, DeleteCommentInput, DeleteCommentResponse, UpdateCommentInput} from "./args";

// Models
import {Comment} from "../../models/Comment";

// Types
import {Errors, MyContext} from "../../types";

class CommentService {
    async create({payload}: MyContext, {text, cardId}: CreateCommentInput): Promise<Comment> {
        if (!payload?.userId) {
            throw new ApolloError('Нет доступа', Errors.PERMISSIONS_ERROR);
        }

        try {
            const comment: Comment = await Comment.create({card_id: cardId, text, user_id: payload.userId});
            return comment;
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }
    }

    async update({commentId, text}: UpdateCommentInput): Promise<Comment> {
        const comment: Comment | null = await Comment.findOne({where: {id: commentId}});

        if (!comment) {
            throw new ApolloError('Такого комментария не существует', Errors.READ_ERROR);
        }

        try {
            await comment.update({text});
            return comment;
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }
    }

    async delete({commentId}: DeleteCommentInput): Promise<DeleteCommentResponse> {
        const comment: Comment | null = await Comment.findOne({where: {id: commentId}});

        if (!comment) {
            throw new ApolloError('Такого комментария не существует', Errors.READ_ERROR);
        }

        try {
            await comment.destroy();
            return {
                message: 'Комменатрий успешно удален'
            }
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }
    }
}

export default new CommentService();