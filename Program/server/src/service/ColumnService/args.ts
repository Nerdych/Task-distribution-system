// Core
import {Field, InputType, Int, InterfaceType, ObjectType} from "type-graphql";
import {Length} from "class-validator";

// Validators
import {OrganizationFound} from "../../validators/organizationFound";
import {DeskFound} from "../../validators/deskFound";
import {ColumnFound} from "../../validators/columnFound";

@InterfaceType()
class ColumnResponse {
    @Field(() => String)
    message!: string;
}

@ObjectType({implements: [ColumnResponse]})
export class CreateColumnResponse extends ColumnResponse {
};

@ObjectType({implements: [ColumnResponse]})
export class UpdateColumnResponse extends ColumnResponse {
};

@ObjectType({implements: [ColumnResponse]})
export class DeleteColumnResponse extends ColumnResponse {
};

@InputType({description: "Create column data"})
export class CreateColumnInput {
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

    @Field(() => String)
    @Length(1, 255, {
        message: 'Название колонки должно иметь минимум один знак и максимум 255 символов'
    })
    name!: string;
}

@InputType({description: "Update column data"})
export class UpdateColumnInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индетефикатором не найдена'
    })
    orgId!: number;

    @Field(() => String)
    @Length(1, 255, {
        message: 'Название колонки должно иметь минимум один знак и максимум 255 символов'
    })
    name!: string;

    @Field(() => Int)
    @DeskFound({
        message: 'Доска с таким индентификатором не найдена'
    })
    deskId!: number;

    @Field(() => Int)
    @ColumnFound({
        message: 'Колонка с таким индентификатором не найдена'
    })
    columnId!: number;
}

@InputType({description: "Delete column data"})
export class DeleteColumnInput {
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
    @ColumnFound({
        message: 'Колонка с таким индентификатором не найдена'
    })
    columnId!: number;
}