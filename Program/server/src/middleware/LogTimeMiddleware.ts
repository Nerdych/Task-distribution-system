// Core
import {MiddlewareFn} from "type-graphql/dist/interfaces/Middleware";

export const LogTimeMiddleware: MiddlewareFn = async ({ info }, next) => {
    const start = Date.now();
    await next();
    const resolveTime = Date.now() - start;
    console.log(`${info.parentType.name}.${info.fieldName} [${resolveTime} ms]`);
};