// Core
import {Field, InputType, Int, InterfaceType, ObjectType} from "type-graphql";
import {Length} from "class-validator";

// Validators
import {OrganizationFound} from "../../validators/organizationFound";
import {DeskFound} from "../../validators/deskFound";

@InterfaceType()
class MessageResponse {
    @Field(() => String)
    message!: string;
}

@ObjectType({implements: [MessageResponse]})
export class SendMessageResponse extends MessageResponse {
};

@ObjectType({implements: [MessageResponse]})
export class UpdateMessageResponse extends MessageResponse {
};

@ObjectType({implements: [MessageResponse]})
export class DeleteMessageResponse extends MessageResponse {
};

@InputType({description: "Send message data"})
export class SendMessageInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индетефикатором не найдена'
    })
    orgId!: number;

    @Field(() => String)
    @Length(1, 255, {
        message: 'Сообщение должно иметь минимум один знак и максимум 255'
    })
    text!: string;

    @Field(() => Int)
    @DeskFound({
        message: 'Доска с таким индентификатором не найдена'
    })
    deskId!: number;
}

@InputType({description: "Update message data"})
export class UpdateMessageInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индетефикатором не найдена'
    })
    orgId!: number;

    @Field(() => String)
    @Length(1, 255, {
        message: 'Сообщение должно иметь минимум один знак и максимум 255'
    })
    text!: string;

    @Field(() => Int)
    @DeskFound({
        message: 'Доска с таким индентификатором не найдена'
    })
    deskId!: number;

    @Field(() => Int)
    messageId!: number;
}

@InputType({description: "Delete message data"})
export class DeleteMessageInput {
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
    messageId!: number;
}