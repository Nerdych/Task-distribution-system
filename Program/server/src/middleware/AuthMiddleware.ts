// Core
import {Middleware} from "type-graphql/dist/interfaces/Middleware";
import {JwtPayload, verify} from "jsonwebtoken";
import {ApolloError} from "apollo-server-express";

// Types
import {MyContext} from "../types";

export const AuthMiddleware: Middleware<MyContext> = ({context}, next) => {
    const authorization: string | undefined = context.req.headers['authorization'];

    if (!authorization) {
        throw new ApolloError('Вы не авторизованы', 'AUTHORIZATION_ERROR');
    }

    try {
        const token: string = authorization?.split(' ')[1];
        const payload: JwtPayload = verify(token, process.env.ACCESS_TOKEN_SECRET || 'ACCESS_TOKEN_SECRET');
        context.payload = payload;
    } catch (e) {
        console.error(e);
        throw new ApolloError('Вы не авторизованы', 'TOKEN_ERROR');
    }

    return next();
}