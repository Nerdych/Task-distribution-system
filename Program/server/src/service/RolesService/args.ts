// Core
import {Field, InputType, Int} from "type-graphql";

// Validators
import {OrganizationFound} from "../../validators/organizationFound";

// Types
import {DefaultRoles} from "../../types";

export interface CreateDefaultRoleArgs {
    orgId: number;
    role: DefaultRoles
}

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
