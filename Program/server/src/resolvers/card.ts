// Core
import {Arg, Mutation, Resolver, UseMiddleware} from "type-graphql";
import {FileUpload, GraphQLUpload} from "graphql-upload";

// Service
import CardService from "../service/CardService/CardService";

// Middleware
import {AuthMiddleware} from "../middleware/AuthMiddleware";

// Decorators
import {RightDecorator} from "../decorators/RightDecorator";

// Types
import {DesksRights, OrganizationRights} from "../types";

// Models
import {Card} from "../models/Card";

// Args
import {
    CreateCardInput,
    DeleteCardInput,
    DeleteCardResponse,
    UpdateCardInput,
    UploadImageInput, UploadImageResponse
} from "../service/CardService/agrs";
import FileService from "../service/FileService/FileService";

@Resolver()
export class CardResolver {
    // @Query(() => [Card], {nullable: true})
    // @UseMiddleware(AuthMiddleware)
    // async cards(@Arg('options') options: GetAllCardsInput): Promise<Card[]> {
    //     return CardService.getAll(options);
    // }

    @Mutation(() => Card)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({deskRights: [DesksRights.CREATE_CARD]})
    async createCard(@Arg('options') options: CreateCardInput): Promise<Card> {
        return CardService.create(options);
    }

    @Mutation(() => Card)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({deskRights: [DesksRights.UPDATE_CARD]})
    async updateCard(@Arg('options') options: UpdateCardInput): Promise<Card> {
        return CardService.update(options);
    }

    @Mutation(() => DeleteCardResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({deskRights: [DesksRights.DELETE_CARD]})
    async deleteCard(@Arg('options') options: DeleteCardInput): Promise<DeleteCardResponse> {
        return CardService.delete(options);
    }

    @Mutation(() => UploadImageResponse)
    @UseMiddleware(AuthMiddleware)
    @RightDecorator({organizationRights: [OrganizationRights.UPDATE_DESK]})
    async uploadImage(@Arg('options') options: UploadImageInput): Promise<UploadImageResponse> {
        return CardService.uploadImage(options);
    }
}