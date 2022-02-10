// Core
import {ApolloError} from "apollo-server-express";

// Models
import {List} from "../../models/List";

// Types
import {Errors} from "../../types";

// Args
import {CreateListInput, DeleteListInput, DeleteListResponse, UpdateListInput} from "./args";


class ListService {
    async create({cardId, name}: CreateListInput): Promise<List> {
        try {
            return await List.create({card_id: cardId, name});
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }
    }

    async update({listId, name}: UpdateListInput): Promise<List> {
        const list: List | null = await List.findOne({where: {id: listId}});

        if (!list) {
            throw new ApolloError('Такого списка не существует', Errors.READ_ERROR);
        }

        try {
            return list.update({name});
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }
    }

    async delete({listId}: DeleteListInput): Promise<DeleteListResponse> {
        const list: List | null = await List.findOne({where: {id: listId}});

        if (!list) {
            throw new ApolloError('Такого списка не существует', Errors.READ_ERROR);
        }

        try {
            await list.destroy();
            return {
                message: 'Чек лист успешно удален'
            }
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }
    }
}

export default new ListService();