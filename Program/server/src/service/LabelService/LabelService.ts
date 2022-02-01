// Core
import {ApolloError} from "apollo-server-express";

// Args
import {
    CreateLabelInput,
    CreateLabelResponse,
    DeleteLabelInput, DeleteLabelResponse,
    GetAllLabelsInput,
    UpdateLabelInput,
    UpdateLabelResponse
} from "./args";

// Models
import {Label} from "../../models/Label";

// Types
import {Errors} from "../../types";

class LabelService {
    async getAll({orgId}: GetAllLabelsInput): Promise<Label[]> {
        const labels: Label[] | null = await Label.findAll({where: {organization_id: orgId}});
        return labels;
    }

    async create({orgId, color, title}: CreateLabelInput): Promise<CreateLabelResponse> {
        try {
            const label: Label = await Label.create({organization_id: orgId, color, title});

            return {
                message: 'Лейбл успешно создан'
            }
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }
    }

    async update({color, title, labelId}: UpdateLabelInput): Promise<UpdateLabelResponse> {
        const label: Label | null = await Label.findOne({where: {id: labelId}});

        if (!label) {
            throw new ApolloError('Такого лейбла не существует', Errors.READ_ERROR);
        }

        try {
            await label.update({color, title});
            return {
                message: 'Лейбл успешно обновлен'
            }
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }
    }

    async delete({labelId}: DeleteLabelInput): Promise<DeleteLabelResponse> {
        const label: Label | null = await Label.findOne({where: {id: labelId}});

        if (!label) {
            throw new ApolloError('Такого лейбла не существует', Errors.READ_ERROR);
        }

        try {
            await label.destroy();
            return {
                message: 'Лейбл успешно удален'
            }
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }
    }
}

export default new LabelService();