// Core
import {Field, InputType, Int, InterfaceType, ObjectType} from "type-graphql";

// Validators
import {OrganizationFound} from "../../validators/organizationFound";

// Types
import {DefaultRoles} from "../../types";
import {RoleFound} from "../../validators/roleFound";

export interface CreateDefaultRoleArgs {
    orgId: number;
    role: DefaultRoles
}

@InterfaceType()
class RolesResponse {
    @Field(() => String)
    message!: string;
}

@ObjectType({implements: [RolesResponse]})
export class UpdateRolesResponse extends RolesResponse {
};

@InputType({description: "Get organization roles data"})
export class GetOrganizationRolesInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;
}

@InputType({description: "Get desk roles data"})
export class GetDeskRolesInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;
}

@InputType({description: "Create desk roles data"})
export class CreateRolesInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;
}

@InputType({description: "Update desk roles data"})
export class UpdateRoleInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;

    @Field(() => Int)
    @RoleFound({
        message: 'Роль с таким индентификатором не найдена'
    })
    roleId!: number;
}
