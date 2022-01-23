// Core
import {Field, InputType, Int, InterfaceType, ObjectType} from "type-graphql";
import {Length} from "class-validator";
import {OrganizationFound} from "../../validators/organizationFound";

@InterfaceType()
class DeskResponse {
    @Field(() => String)
    message!: string;
}

@ObjectType({implements: [DeskResponse]})
export class CreateDeskResponse extends DeskResponse {
};


// TODO ЭКСПЕРИМЕНТИРУЕМ
@InputType({description: "Create desk data"})
export class CreateDeskInput {
    @Field(() => String)
    @Length(1, 255, {
        message: 'Название доски должно быть не меньше 1 знака и не более 255 знаков'
    })
    name!: string;

    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;

    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    roleId!: number;

    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    deskId!: number;
}

@InputType({description: "Get desk by id data"})
export class GetDeskInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индетефикатором не найдена'
    })
    id!: number;
}