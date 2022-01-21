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

export enum PurposeTypes {
    organization = 1,
    desk = 2
}


