// Core
import {Request, Response} from 'express'
import {JwtPayload} from "jsonwebtoken";

export type MyContext = {
    req: Request,
    res: Response,
    payload?: JwtPayload & { userId?: number }
};