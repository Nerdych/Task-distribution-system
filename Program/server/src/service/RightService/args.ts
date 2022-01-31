// Core
import {ArgsDictionary, Field, InputType, Int, ObjectType} from "type-graphql";

// Models
import {Right} from "../../models/Right";
import {Role} from "../../models/Role";

// Types
import {DesksRights, ObjectTypes, OrganizationRights} from "../../types";

@ObjectType()
export class ObjectData {
    @Field(() => String)
    name!: string

    @Field(() => String)
    code!: string

    @Field(() => [Right])
    rights!: (Right & {children?: Right[]})[]
}

type ReqData = ArgsDictionary;

export interface RoleRight {
    data: Right;
    beginCondition?: string;
    role: Role;
}

export interface GetOrganizationRightsArgs {
    orgId: number;
    userId: number;
}

export interface GetDeskRightsArgs {
    deskId: number;
    userId: number;
}

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

export interface AddRolesRightArgs {
    roleId: number;
    rights: { rightId: number, begin_condition: number }[];
}

@InputType({description: "Get all rights by object data"})
export class GetAllRightsByObjectInput {
    @Field(() => String)
    object!: ObjectTypes.ORGANIZATION_OBJECT | ObjectTypes.DESKS_OBJECT;
}
