// Core
import NodeCache from "node-cache";
import {Request, Response} from 'express'
import {JwtPayload} from "jsonwebtoken";

export type MyContext = {
    req: Request,
    res: Response,
    cache: NodeCache,
    payload?: JwtPayload & { userId?: number }
};

export enum OrganizationRights {
    CREATE_DESK = 'CREATE_DESK',
    READ_DESK = 'READ_DESK',
    UPDATE_NAME_DESK = 'UPDATE_NAME_DESK',
    DELETE_DESK = 'DELETE_DESK',
    READ_LABELS = 'READ_LABELS',
    CREATE_LABEL = 'CREATE_LABEL',
    UPDATE_LABEL = 'UPDATE_LABEL',
    DELETE_LABEL = 'DELETE_LABEL',
}

export enum DesksRights {
    INVITE_USER_ON_DESK = 'INVITE_USER_ON_DESK',
    READ_ROLES_ON_DESK = 'READ_ROLES_ON_DESK',
}

export enum BeginCondition {
    ONLY_THEIR = 'ONLY_THEIR',
    ONLY_LOWER_STATUS = 'ONLY_LOWER_STATUS',
    ALL = 'ALL',
    ONLY_PIN = 'ONLY_PIN',
    YES = 'YES',
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
}


