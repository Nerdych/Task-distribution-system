// Core
import {Field, InputType, Int, InterfaceType, ObjectType} from "type-graphql";
import {Length} from "class-validator";
import {OrganizationFound} from "../../validators/organizationFound";

// Models
import {Desk} from "../../models/Desk";
import {RoleRight} from "../RightService/args";
import {Right} from "../../models/Right";
import {Role} from "../../models/Role";

@InterfaceType()
class OrganizationResponse {
    @Field(() => String)
    message!: string;
}

@ObjectType({implements: [OrganizationResponse]})
export class CreateOrganizationResponse extends OrganizationResponse {};

@ObjectType({implements: [OrganizationResponse]})
export class UpdateOrganizationResponse extends OrganizationResponse {};

@ObjectType({implements: [OrganizationResponse]})
export class DeleteOrganizationResponse extends OrganizationResponse {};

@ObjectType()
export class GetOrganizationResponse {
    @Field(() => String)
    name!: string

    @Field(() => [Desk], {nullable: true})
    desks: Desk[] | null

    @Field(() => [{data: Right, beginCondition: String, role: Role}], {nullable: true})
    rights?: RoleRight[]
};

@InputType({description: "Create organization data"})
export class CreateOrganizationInput {
    @Field(() => String)
    @Length(1, 255, {
        message: 'Название организации должно быть не меньше 1 знака и не более 255 знаков'
    })
    name!: string;
}

@InputType({description: "Update organization data"})
export class UpdateOrganizationInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;

    @Field(() => String)
    @Length(1, 255, {
        message: 'Название организации должно быть не меньше 1 знака и не более 255 знаков'
    })
    name!: string;

    @Field(() => String)
    @Length(3, 255, {
        message: 'Ссылка должна содержать минимум 3 символа'
    })
    linkToInvite!: string;
}

@InputType({description: "Get organization data"})
export class GetOrganizationInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;
}

@InputType({description: "Get organization info data"})
export class GetOrganizationInfoInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;
}

@InputType({description: "Delete organization data"})
export class DeleteOrganizationInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;
}