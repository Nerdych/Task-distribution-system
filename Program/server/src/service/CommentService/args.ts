// Core
import {Field, InputType, Int, InterfaceType, ObjectType} from "type-graphql";
import {Length} from "class-validator";

// Validators
import {OrganizationFound} from "../../validators/organizationFound";
import {DeskFound} from "../../validators/deskFound";
import {CommentFound} from "../../validators/commentFound";
import {CardFound} from "../../validators/cardFound";

@InterfaceType()
class CommentResponse {
    @Field(() => String)
    message!: string;
}

@ObjectType({implements: [CommentResponse]})
export class DeleteCommentResponse extends CommentResponse {};

@InputType({description: "Create comment data"})
export class CreateCommentInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индетефикатором не найдена'
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
        message: 'Название колонки должно иметь минимум один знак и максимум 255 символов'
    })
    text!: string;
}

@InputType({description: "Update comment data"})
export class UpdateCommentInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индетефикатором не найдена'
    })
    orgId!: number;

    @Field(() => Int)
    @DeskFound({
        message: 'Доска с таким индентификатором не найдена'
    })
    deskId!: number;

    @Field(() => Int)
    @CommentFound({
        message: 'Комментарий с таким индентификатором не найден'
    })
    commentId!: number;

    @Field(() => String)
    @Length(1, 255, {
        message: 'Название колонки должно иметь минимум один знак и максимум 255 символов'
    })
    text!: string;
}

@InputType({description: "Delete comment data"})
export class DeleteCommentInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индетефикатором не найдена'
    })
    orgId!: number;

    @Field(() => Int)
    @DeskFound({
        message: 'Доска с таким индентификатором не найдена'
    })
    deskId!: number;

    @Field(() => Int)
    @CommentFound({
        message: 'Комментарий с таким индентификатором не найден'
    })
    commentId!: number;
}