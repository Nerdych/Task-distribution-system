// Core
import {ApolloError} from "apollo-server-express";

// Args
import {
    CreateCardInput,
    DeleteCardInput,
    DeleteCardResponse,
    GetAllCardsInput,
    UpdateCardInput,
    UploadImageInput, UploadImageResponse
} from "./agrs";

// Models
import {Card} from "../../models/Card";

// Types
import {BeginCondition as BeginConditionTypes, DesksRights, Errors, MyContext, OrganizationRights} from "../../types";
import {UserOrganization} from "../../models/UserOrganization";
import {Role} from "../../models/Role";
import {RoleRight} from "../../models/RoleRight";
import {BeginCondition} from "../../models/BeginCondition";
import {Right} from "../../models/Right";
import {Desk} from "../../models/Desk";
import FileService from "../FileService/FileService";

class CardService {
    // async getAll({payload}: MyContext, {columnId, orgId}: GetAllCardsInput): Promise<Card[]> {
    //     const getAllCards = async (): Promise<Card[]> => {
    //         return await Card.findAll();
    //     }
    //
    //     const getConnectCards = async (): Promise<Card[]> => {
    //         let cards: Card[] = Card.findAll({where: });
    //     }
    //
    //     if (!payload?.userId) {
    //         throw new ApolloError('Нет прав доступа', Errors.PERMISSIONS_ERROR);
    //     }
    //
    //     const userOrganization: UserOrganization | null = await UserOrganization.findOne({
    //         where: {
    //             user_id: payload.userId,
    //             organization_id: orgId
    //         }, include: {model: Role, include: [{model: RoleRight, include: [{model: BeginCondition}]}]}
    //     })
    //
    //     if (!userOrganization) {
    //         throw new ApolloError('Нет прав для доступа к данной организации', Errors.PERMISSIONS_ERROR);
    //     }
    //
    //     const needRight: Right | null = await Right.findOne({where: {code: DesksRights.}});
    //
    //     if (!needRight) {
    //         throw new ApolloError('Такого права не существует', Errors.READ_ERROR);
    //     }
    //
    //     const conditions: BeginConditionTypes[] | null = userOrganization.roles.reduce((acc: BeginConditionTypes[], role) => {
    //         const findRight: RoleRight | undefined = role.role_rights.find(roleRight => roleRight.right_id === needRight.id);
    //         if (findRight) {
    //             return [...acc, findRight.begin_condition.code]
    //         } else {
    //             return acc
    //         }
    //     }, []);
    //
    //     if (conditions) {
    //         const isGetAll: boolean = conditions.includes(BeginConditionTypes.ALL);
    //
    //         if (isGetAll) {
    //             return getAllCards();
    //         }
    //
    //         const isOnlyConnect: boolean = conditions.includes(BeginConditionTypes.ONLY_THEIR) || conditions.includes(BeginConditionTypes.ONLY_PIN);
    //
    //         if (isOnlyConnect) {
    //             return getConnectCards();
    //         }
    //
    //         return [];
    //     }
    //
    //     return [];
    // }

    async create({columnId, name}: CreateCardInput): Promise<Card> {
        try {
            const card: Card = await Card.create({name, column_id: columnId});
            return card;
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }
    }

    async update({cardId, description, columnId, name, deadline, isArchived, userId}: UpdateCardInput): Promise<Card> {
        const card: Card | null = await Card.findOne({where: {id: cardId}});

        if (!card) {
            throw new ApolloError('Такой карточки не существует', Errors.READ_ERROR);
        }

        // TODO не все апдейтим
        try {
            await card.update({
                name,
                deadline,
                description,
                column_id: columnId,
                is_archived: isArchived,
                user_id: userId
            });
            return card;
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }
    }

    async delete({cardId}: DeleteCardInput): Promise<DeleteCardResponse> {
        const card: Card | null = await Card.findOne({where: {id: cardId}});

        if (!card) {
            throw new ApolloError('Такой карточки не существует', Errors.READ_ERROR);
        }

        try {
            await card.destroy();
            return {
                message: 'Карточка успешно удалена'
            }
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }
    }

    async uploadImage({cardId, image}: UploadImageInput): Promise<UploadImageResponse> {
        const card: Card | null = await Card.findOne({where: {id: cardId}});

        if (!card) {
            throw new ApolloError('Такой карточки не существует', Errors.READ_ERROR);
        }

        const {fileUrl, description} = await FileService.create({file: image});

        try {

        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }

        return {
            message: "Изображение успешно загружено",
            imageUrl: fileUrl,
            description
        }
    }
}

export default new CardService();