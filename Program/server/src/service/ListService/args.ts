// Core
import {Field, InputType, Int, InterfaceType, ObjectType} from "type-graphql";
import {Length} from "class-validator";

// Validators
import {OrganizationFound} from "../../validators/organizationFound";
import {DeskFound} from "../../validators/deskFound";
import {CardFound} from "../../validators/cardFound";
import {ListFound} from "../../validators/listFound";

@InterfaceType()
class ListResponse {
    @Field(() => String)
    message!: string;
}

@ObjectType({implements: [ListResponse]})
export class DeleteListResponse extends ListResponse {
};

@InputType({description: 'Create list data'})
export class CreateListInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;

    @Field(() => Int)
    @DeskFound({
        message: 'Доска с таким индентификатором не найдена'
    })
    deskId!: number;

    @Field(() => Int)
    @CardFound({
        message: 'Карточка с таким индентификатором не найдена'
    })
    cardId!: number;

    @Field(() => String)
    @Length(1, 255, {
        message: 'Название чек-листа должно иметь минимум один знак и максимум 255 символов'
    })
    name!: string;
};

@InputType({description: 'Update list data'})
export class UpdateListInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;

    @Field(() => Int)
    @DeskFound({
        message: 'Доска с таким индентификатором не найдена'
    })
    deskId!: number;

    @Field(() => Int)
    @ListFound({
        message: 'Списка с таким индентификатором не найдена'
    })
    listId!: number;

    @Field(() => String)
    @Length(1, 255, {
        message: 'Название чек-листа должно иметь минимум один знак и максимум 255 символов'
    })
    name!: string;
};

@InputType({description: 'Delete list data'})
export class DeleteListInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;

    @Field(() => Int)
    @DeskFound({
        message: 'Доска с таким индентификатором не найдена'
    })
    deskId!: number;

    @Field(() => Int)
    @ListFound({
        message: 'Списка с таким индентификатором не найдена'
    })
    listId!: number;
};