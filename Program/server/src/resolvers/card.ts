// Core
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";

// Service
import CardService from "../service/CardService/CardService";

// Middleware
import {AuthMiddleware} from "../middleware/AuthMiddleware";

// Decorators
import {RightDecorator} from "../decorators/RightDecorator";

// Types
import {MyContext, OrganizationRights} from "../types";

// Models
import {Card} from "../models/Card";

// Args
import {
    CreateCardInput,
    DeleteCardInput,
    DeleteCardResponse,
    GetAllCardsInput,
    UpdateCardInput
} from "../service/CardService/agrs";

@Resolver()
export class CardResolver {
    @Query(() => [Card], {nullable: true})
    @UseMiddleware(AuthMiddleware)
    async cards(@Arg('options') options: GetAllCardsInput): Promise<Card[]> {
        return CardService.getAll(options);
    }

    @Mutation(() => Card)
    @UseMiddleware(AuthMiddleware)
    async createCard(@Arg('options') options: CreateCardInput): Promise<Card> {
        return CardService.create(options);
    }

    @Mutation(() => Card)
    @UseMiddleware(AuthMiddleware)
    async updateCard(@Arg('options') options: UpdateCardInput): Promise<Card> {
        return CardService.update(options);
    }

    @Mutation(() => DeleteCardResponse)
    @UseMiddleware(AuthMiddleware)
    async deleteCard(@Arg('options') options: DeleteCardInput): Promise<DeleteCardResponse> {
        return CardService.delete(options);
    }
}