// Core
import {Field, InputType, Int, InterfaceType, ObjectType} from "type-graphql";
import {Length} from "class-validator";

// Validators
import {OrganizationFound} from "../../validators/organizationFound";
import {isHex} from "../../validators/isHex";
import {LabelFound} from "../../validators/labelFound";

@InterfaceType()
class LabelResponse {
    @Field(() => String)
    message!: string;
}

@ObjectType({implements: [LabelResponse]})
export class CreateLabelResponse extends LabelResponse {
};

@ObjectType({implements: [LabelResponse]})
export class UpdateLabelResponse extends LabelResponse {
};

@ObjectType({implements: [LabelResponse]})
export class DeleteLabelResponse extends LabelResponse {
};

@InputType({description: 'Get all labels data'})
export class GetAllLabelsInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;
};

@InputType()
export class CreateLabelInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;

    @Field(() => String)
    @Length(1, 255, {
        message: 'Название лейбла должно быть не меньше 1 знака и не более 255 знаков'
    })
    title: string;

    @Field(() => String)
    @isHex({
        message: 'Недопустимое значение HEX'
    })
    color: string;
};

@InputType()
export class UpdateLabelInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;

    @Field(() => Int)
    @LabelFound({
        message: 'Лейбл с таким индентификатором не найден'
    })
    labelId!: number;

    @Field(() => String, {nullable: true})
    @Length(1, 255, {
        message: 'Название лейбла должно быть не меньше 1 знака и не более 255 знаков'
    })
    title?: string;

    @Field(() => String, {nullable: true})
    @isHex({
        message: 'Недопустимое значение HEX'
    })
    color?: string;
};

@InputType()
export class DeleteLabelInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;

    @Field(() => Int)
    @LabelFound({
        message: 'Лейбл с таким индентификатором не найден'
    })
    labelId!: number;
};