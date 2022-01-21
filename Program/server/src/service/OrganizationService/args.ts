// Core
import {Field, InputType, InterfaceType, ObjectType} from "type-graphql";
import {Length} from "class-validator";

@InterfaceType()
class OrganizationResponse {
    @Field(() => String)
    message!: string;
}

@ObjectType({implements: [OrganizationResponse]})
export class CreateOrganizationResponse extends OrganizationResponse {};

@InputType({description: "Create organization data"})
export class CreateOrganizationInput {
    @Field(() => String)
    @Length(1, 255, {
        message: 'Название организации должно быть не меньше 1 знака и не более 255 знаков'
    })
    name!: string;
}