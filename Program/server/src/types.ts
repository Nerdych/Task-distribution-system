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

export enum ErrorTypes {
    ARGUMENT_VALIDATION_ERROR = "Argument Validation Error",
}