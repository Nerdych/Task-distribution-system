// Core
import {ApolloError} from "apollo-server-express";
import {createMethodDecorator} from "type-graphql";
import {MiddlewareFn} from "type-graphql/dist/interfaces/Middleware";

// Types
import {DesksRights, MyContext, OrganizationRights} from "../types";

// Args
import {RoleRight as IRoleRightInterface} from "../service/RightService/args";

// Models
import {User} from "../models/User";

// Service
import RightService from "../service/RightService/RightService";

interface IRightDecoratorArgs {
    organizationRights?: OrganizationRights[],
    deskRights?: DesksRights[],
}

export function RightDecorator({organizationRights = [], deskRights = []}: IRightDecoratorArgs) {
    const RightMiddleware: MiddlewareFn<MyContext> = async ({context, args}, next) => {
        const user: User | null = await User.findOne({where: {id: context.payload?.userId}});

        if (!user) {
            throw new ApolloError('Невозможно получить доступ', 'PERMISSIONS_ERROR');
        }

        let userOrganizationRights: IRoleRightInterface[] = [];
        let userDesksRights: IRoleRightInterface[] = [];

        userOrganizationRights = await RightService.getUserOrganizationRights({
            orgId: args.options.orgId,
            userId: user.id
        });

        // TODO проверить то что мы передали является ли компонентов именно этой организации

        if (deskRights?.length) {
            userDesksRights = await RightService.getUserDeskRights({
                deskId: args.options.deskId,
                userId: user.id
            });
        }

        const compareRights: boolean = await RightService.compareRights({
            haveRights: [...userOrganizationRights, ...userDesksRights],
            needRights: [...organizationRights, ...deskRights],
            reqData: {
                user,
                context,
                ...args
            }
        });

        if (!compareRights) {
            throw new ApolloError('Невозможно получить доступ', 'PERMISSIONS_ERROR');
        }

        return next();
    }

    return createMethodDecorator(RightMiddleware);
}