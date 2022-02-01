// Core
import NodeCache from "node-cache";
import {Request, Response} from 'express'
import {JwtPayload} from "jsonwebtoken";

export type MyContext = {
    req: Request,
    res: Response,
    cache: NodeCache,
    payload?: JwtPayload & { userId?: number },
};

export enum OrganizationRights {
    CREATE_DESK = 'CREATE_DESK',
    READ_DESK = 'READ_DESK',
    UPDATE_DESK = 'UPDATE_DESK',
    DELETE_DESK = 'DELETE_DESK',
    READ_LABELS = 'READ_LABELS',
    CREATE_LABEL = 'CREATE_LABEL',
    UPDATE_LABEL = 'UPDATE_LABEL',
    DELETE_LABEL = 'DELETE_LABEL',
    READ_ORGANIZATION_ROLES = 'READ_ORGANIZATION_ROLES',
    READ_DESK_ROLES = 'READ_DESK_ROLES',
    READ_ORGANIZATION_INFO = 'READ_ORGANIZATION_INFO',
    UPDATE_ORGANIZATION = 'UPDATE_ORGANIZATION',
    DELETE_ORGANIZATION = 'DELETE_ORGANIZATION',
    CREATE_ORGANIZATION_ROLE = 'CREATE_ORGANIZATION_ROLE',
    CREATE_DESK_ROLE = 'CREATE_DESK_ROLE',
    UPDATE_ORGANIZATION_ROLE = 'UPDATE_ORGANIZATION_ROLE',
    UPDATE_DESK_ROLE = 'UPDATE_DESK_ROLE',
    DELETE_DESK_ROLE = 'DELETE_DESK_ROLE',
    DELETE_ORGANIZATION_ROLE = 'DELETE_ORGANIZATION_ROLE',
    READ_EMPLOYEES = 'READ_EMPLOYEES'
}

export enum DesksRights {
    INVITE_USER_ON_DESK = 'INVITE_USER_ON_DESK',
    READ_ROLES_ON_DESK = 'READ_ROLES_ON_DESK',
    READ_DESK_INFO = 'READ_DESK_INFO'
}

export enum BeginCondition {
    ONLY_THEIR = 'ONLY_THEIR',
    ONLY_LOWER_STATUS = 'ONLY_LOWER_STATUS',
    ALL = 'ALL',
    ONLY_PIN = 'ONLY_PIN',
    YES = 'YES',
    NO = 'NO'
}

export enum PurposeTypes {
    organization = 1,
    desk = 2
}

export enum ObjectTypes {
    DESKS_OBJECT = 'DESKS_OBJECT',
    LABELS_OBJECT = 'LABELS_OBJECT',
    CARDS_OBJECT = 'CARDS_OBJECT',
    ROLES_OBJECT = 'ROLES_OBJECT',
    ORGANIZATION_OBJECT = 'ORGANIZATION_OBJECT',
    EMPLOYEES_OBJECT = 'EMPLOYEES_OBJECT'
}

export enum Errors {
    PERMISSIONS_ERROR = 'PERMISSIONS_ERROR',
    TOKEN_ERROR = 'TOKEN_ERROR',
    READ_ERROR = 'READ_ERROR',
    SOMETHING_ERROR = 'SOMETHING_ERROR'
}

export enum DefaultRoles {
    EXECUTOR = 'Исполнитель',
    EMPLOYEE = 'Сотрудник',
    ORGANIZATION_OWNER = 'Владелец организации',
    DESK_OWNER = 'DESK_OWNER'
}


