// Core
import {ArgsDictionary, Field, InputType, Int} from "type-graphql";

// Models
import {Right} from "../../models/Right";
import {Role} from "../../models/Role";

// Types
import {ObjectTypes} from "../../types";

// Validators
import {OrganizationFound} from "../../validators/organizationFound";
import {DeskFound} from "../../validators/deskFound";

export interface GetOrganizationRightsArgs {
    orgId: number;
    userId: number;
}

export interface GetDeskRightsArgs {
    deskId: number;
    userId: number;
}

export interface RoleRight {
    data: Right;
    beginCondition?: string;
    role: Role;
}

type ReqData = ArgsDictionary;

export interface CompareRightsArgs {
    haveRights: RoleRight[];
    needRights: string[];
    reqData: ReqData;
}

export interface CheckDistributionArgs {
    roleRight: RoleRight;
    reqData: ReqData;
}

export interface SelectConditionFunctionArgs {
    condition: string;
}

export interface ConditionFunctionArgs {
    model: ObjectTypes;
    reqData: ReqData;
    role: Role;
}

@InputType({description: "Get organization roles data"})
export class getOrganizationRolesInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;
}

@InputType({description: "Get desk roles data"})
export class getDeskRolesInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;
}

@InputType({description: "Create desk data"})
export class createDeskInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;
}
