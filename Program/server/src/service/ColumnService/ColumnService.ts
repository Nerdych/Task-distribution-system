// Core
import {ApolloError} from "apollo-server-express";

// Args
import {
    CreateColumnInput,
    CreateColumnResponse,
    DeleteColumnInput, DeleteColumnResponse,
    UpdateColumnInput,
    UpdateColumnResponse
} from "./args";

// Types
import {Errors} from "../../types";

// Models
import {ColumnTable} from "../../models/Column";

class ColumnService {
    async create({name, deskId}: CreateColumnInput): Promise<CreateColumnResponse> {
        try {
            await ColumnTable.create({name, desk_id: deskId});
            return {
                message: 'Колонка успешно создана'
            }
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }
    }

    async update({columnId, name}: UpdateColumnInput): Promise<UpdateColumnResponse> {
        const column: ColumnTable | null = await ColumnTable.findOne({where: {id: columnId}});

        if (!column) {
            throw new ApolloError('Такой колонки не существует', Errors.READ_ERROR);
        }

        try {
            await column.update({name});
            return {
                message: 'Колонка успешно обновлена'
            }
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }
    }

    async delete({columnId}: DeleteColumnInput): Promise<DeleteColumnResponse> {
        const column: ColumnTable | null = await ColumnTable.findOne({where: {id: columnId}});

        if (!column) {
            throw new ApolloError('Такой колонки не существует', Errors.READ_ERROR);
        }

        try {
            await column.destroy();
            return {
                message: 'Колонка успешно удалена'
            }
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }
    }
}

export default new ColumnService();