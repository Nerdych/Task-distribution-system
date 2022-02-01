// Core
import {Field, InputType, Int, InterfaceType, ObjectType} from "type-graphql";

// Types
import {DefaultRoles, PurposeTypes} from "../../types";

// Validators
import {OrganizationFound} from "../../validators/organizationFound";
import {PurposeFound} from "../../validators/purposeFound";
import {Length, Min} from "class-validator";
import {RoleFound} from "../../validators/roleFound";

export interface CreateDefaultRoleArgs {
    orgId: number;
    role: DefaultRoles
}

@InterfaceType()
class RoleResponse {
    @Field(() => String)
    message!: string;
}

@ObjectType({implements: [RoleResponse]})
export class CreateRoleResponse extends RoleResponse {
};

@ObjectType({implements: [RoleResponse]})
export class UpdateRoleResponse extends RoleResponse {
};

@ObjectType({implements: [RoleResponse]})
export class DeleteRoleResponse extends RoleResponse {
};

@InputType()
export class CreateRoleRight {
    @Field(() => Int)
    id!: number;

    @Field(() => Int)
    beginConditionId!: number;
};

@InputType()
export class UpdateRoleRight {
    @Field(() => Int)
    id!: number;

    @Field(() => Int, {nullable: true})
    beginConditionId?: number;
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

@InputType({description: "Create role data"})
export class CreateRoleInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;

    @Field(() => Int, {nullable: true})
    @PurposeFound({
        message: 'Роль с таким индентификатором направления не найдена'
    })
    purposeId?: PurposeTypes;

    @Field(() => [CreateRoleRight])
    rights!: CreateRoleRight[];

    @Field(() => Int)
    @Min(1, {
        message: 'Рейтинг роли не может быть меньше 1'
    })
    rating!: number;

    @Field(() => String)
    @Length(1, 255, {
        message: 'Название организации должно быть не меньше 1 знака и не более 255 знаков'
    })
    name!: string;
}

@InputType({description: "Update role data"})
export class UpdateRoleInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;

    @Field(() => Int)
    @PurposeFound({
        message: 'Роль с таким индентификатором направления не найдена'
    })
    purposeId?: PurposeTypes;

    @Field(() => Int)
    @RoleFound({
        message: 'Роль с таким индентификатором не найдена'
    })
    roleId!: number;

    @Field(() => [UpdateRoleRight], {nullable: true})
    rights?: UpdateRoleRight[];

    @Field(() => Int, {nullable: true})
    @Min(1, {
        message: 'Рейтинг роли не может быть меньше 1'
    })
    rating?: number;

    @Field(() => String, {nullable: true})
    @Length(1, 255, {
        message: 'Название организации должно быть не меньше 1 знака и не более 255 знаков'
    })
    name?: string;
}

@InputType({description: "Delete role data"})
export class DeleteRoleInput {
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
