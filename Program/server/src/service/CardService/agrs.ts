// Core
import {Field, InputType, Int, InterfaceType, ObjectType} from "type-graphql";
import {Length} from "class-validator";

// Validators
import {OrganizationFound} from "../../validators/organizationFound";
import {DeskFound} from "../../validators/deskFound";
import {ColumnFound} from "../../validators/columnFound";
import {CardFound} from "../../validators/cardFound";
import {UserFound} from "../../validators/userFound";

@InterfaceType()
class CardResponse {
    @Field(() => String)
    message!: string;
}

@ObjectType({implements: [CardResponse]})
export class DeleteCardResponse extends CardResponse {};

@InputType({description: 'Get all cards data'})
export class GetAllCardsInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индетификатором не найдена'
    })
    orgId!: number;

    @Field(() => Int)
    @DeskFound({
        message: 'Доска с таким индетификатором не найдена'
    })
    deskId!: number;

    @Field(() => Int)
    @ColumnFound({
        message: 'Колонка с таким индетификатором не найдена'
    })
    columnId!: number;
}

@InputType({description: 'Create card data'})
export class CreateCardInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индетификатором не найдена'
    })
    orgId!: number;

    @Field(() => Int)
    @DeskFound({
        message: 'Доска с таким индетификатором не найдена'
    })
    deskId!: number;

    @Field(() => Int)
    @ColumnFound({
        message: 'Колонка с таким индетификатором не найдена'
    })
    columnId!: number;

    @Field(() => String)
    @Length(1, 256, {
        message: 'Название карточки должно содержать хотя бы 1 символ и быть не более 256 символов'
    })
    name!: string;
}

@InputType({description: 'Update card data'})
export class UpdateCardInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индетификатором не найдена'
    })
    orgId!: number;

    @Field(() => Int)
    @DeskFound({
        message: 'Доска с таким индетификатором не найдена'
    })
    deskId!: number;

    @Field(() => Int)
    @ColumnFound({
        message: 'Колонка с таким индетификатором не найдена'
    })
    columnId?: number;

    @Field(() => Int)
    @UserFound({
        message: 'Пользователь с таким индетификатором не найден'
    })
    userId?: number;

    @Field(() => Int)
    @CardFound({
        message: 'Карточка с таким индетификатором не найдена'
    })
    cardId!: number;

    @Field(() => String)
    @Length(1, 256, {
        message: 'Название карточки должно содержать хотя бы 1 символ и быть не более 256 символов'
    })
    name?: string;

    @Field(() => String)
    description?: string;

    @Field(() => String)
    deadline?: Date;

    @Field(() => Boolean)
    isArchived?: boolean;
}

@InputType({description: 'Delete card data'})
export class DeleteCardInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индетификатором не найдена'
    })
    orgId!: number;

    @Field(() => Int)
    @DeskFound({
        message: 'Доска с таким индетификатором не найдена'
    })
    deskId!: number;

    @Field(() => Int)
    @CardFound({
        message: 'Карточка с таким индетификатором не найдена'
    })
    cardId!: number;
}