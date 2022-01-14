// Core
import {Middleware} from "type-graphql/dist/interfaces/Middleware";
import {JwtPayload, verify} from "jsonwebtoken";

// Types
import {MyContext} from "../types";

export const AuthMiddleware: Middleware<MyContext> = ({context}, next) => {
    const authorization: string | undefined = context.req.headers['authorization'];

    if (!authorization) {
        throw new Error('Not authenticated');
    }

    try {
        const token = authorization?.split(' ')[1];
        const payload: JwtPayload = verify(token, process.env.ACCESS_TOKEN_SECRET || 'ACCESS_TOKEN_SECRET');
        context.payload = payload;
    } catch (e) {
        console.error(e);
        throw new Error('Not authenticated');
    }

    return next();
}