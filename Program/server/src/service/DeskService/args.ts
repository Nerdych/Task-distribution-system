// Core
import {Field, InputType, Int, InterfaceType, ObjectType} from "type-graphql";
import {IsNotEmpty, Length} from "class-validator";

// Validators
import {OrganizationFound} from "../../validators/organizationFound";
import {DeskFound} from "../../validators/deskFound";

@InterfaceType()
class DeskResponse {
    @Field(() => String)
    message!: string;
}

@ObjectType({implements: [DeskResponse]})
export class CreateDeskResponse extends DeskResponse {
};

@ObjectType({implements: [DeskResponse]})
export class DeleteDeskResponse extends DeskResponse {
};

@ObjectType({implements: [DeskResponse]})
export class InviteDeskResponse extends DeskResponse {
};

@ObjectType({implements: [DeskResponse]})
export class AddUserDeskResponse extends DeskResponse {
};

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
}

@InputType({description: "Get desk data"})
export class GetDeskInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индетефикатором не найдена'
    })
    orgId!: number;

    @Field(() => Int)
    @DeskFound({
        message: 'Доски с таким индетефикатором не найдена'
    })
    deskId!: number;
}

@InputType({description: "Get desks data"})
export class GetDesksInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;
}

@InputType({description: "Delete desk data"})
export class DeleteDeskInput {
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
}

@InputType({description: "Update desk data"})
export class UpdateDeskInput {
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

    @Field(() => String)
    @IsNotEmpty({
        message: 'Поле имени не должно быть пустым'
    })
    @Length(1, 255, {
        message: 'Название доски должно быть не меньше 1 знака и не более 255 знаков'
    })
    name!: string;
}

@InputType({description: "Invite desk data"})
export class InviteDeskInput {
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

    @Field(() => String)
    userId!: number;
}

@InputType({description: "Add user desk data"})
export class AddUserDeskInput {
    @Field(() => String)
    token!: number;
}