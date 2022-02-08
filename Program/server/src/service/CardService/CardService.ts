// Core
import {ApolloError} from "apollo-server-express";

// Args
import {CreateCardInput, DeleteCardInput, DeleteCardResponse, GetAllCardsInput, UpdateCardInput} from "./agrs";

// Models
import {Card} from "../../models/Card";

// Types
import {Errors} from "../../types";

class CardService {
    async getAll({columnId}: GetAllCardsInput): Promise<Card[]> {
        const cards: Card[] | null = await Card.findAll({where: {column_id: columnId}});
        return cards;
    }

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
}

export default new CardService();