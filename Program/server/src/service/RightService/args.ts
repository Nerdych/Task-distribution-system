// Core
import {ArgsDictionary} from "type-graphql";

// Models
import {Right} from "../../models/Right";
import {Role} from "../../models/Role";

// Types
import {ObjectTypes} from "../../types";

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
