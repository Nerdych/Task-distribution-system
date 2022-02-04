// Core
import {ApolloError} from "apollo-server-express";

// Args
import {
    UpdateMessageInput,
    UpdateMessageResponse,
    SendMessageInput,
    SendMessageResponse,
    DeleteMessageInput, DeleteMessageResponse
} from "./args";

// Types
import {Errors, MyContext} from "../../types";

// Models
import {Message} from "../../models/Message";

class MessageService {
    async send({payload}: MyContext, {text, deskId}: SendMessageInput): Promise<SendMessageResponse> {
        if (!payload?.userId) {
            throw new ApolloError('Ошибка прав доступа', Errors.PERMISSIONS_ERROR);
        }

        const message: Message = await Message.create({text, desk_id: deskId, user_id: payload.userId});

        return {
            message: 'Сообщение отправлено'
        }
    }

    async update({payload}: MyContext, {messageId, text}: UpdateMessageInput): Promise<UpdateMessageResponse> {
        const message: Message | null = await Message.findOne({where: {id: messageId}});

        if (!message) {
            throw new ApolloError('Такого сообщения не существует', Errors.READ_ERROR);
        }

        if (message.user_id !== payload?.userId) {
            throw new ApolloError('Ошибка прав доступа', Errors.PERMISSIONS_ERROR);
        }

        try {
            await message.update({text});
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }

        return {
            message: 'Сообщение успешно отредактировано'
        }
    }

    async delete({payload}: MyContext, {messageId}: DeleteMessageInput): Promise<DeleteMessageResponse> {
        const message: Message | null = await Message.findOne({where: {id: messageId}});

        if (!message) {
            throw new ApolloError('Такого сообщения не существует', Errors.READ_ERROR);
        }

        if (message.user_id !== payload?.userId) {
            throw new ApolloError('Ошибка прав доступа', Errors.PERMISSIONS_ERROR);
        }

        try {
            await message.destroy();
            return {
                message: 'Сообщение успешно удалено'
            }
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }
    }
}

export default new MessageService();