// Core
import {ApolloError} from "apollo-server-express";
import {createMethodDecorator} from "type-graphql";
import {MiddlewareFn} from "type-graphql/dist/interfaces/Middleware";

// Types
import {DesksRights, MyContext, OrganizationRights} from "../types";

// Models
import {User} from "../models/User";
import {UserOrganization} from "../models/UserOrganization";
import {Right} from "../models/Right";
import {UserOrganizationRole} from "../models/UserOrganizationRole";

interface RightDecoratorArgs {
    organizations?: {
        id: number,
        rights: OrganizationRights[],
    };
    desks?: {
        id: number,
        rights: DesksRights[],
    };
}

interface getRightsArgs {
    orgId: number;
    userId: number;
}

const getRights = async ({orgId, userId}: getRightsArgs) => {
    const userOrganization: UserOrganization | null = await UserOrganization.findOne({
        where: {
            organization_id: orgId,
            user_id: userId
        }, include: [{all: true, include: [{all: true, include: [{all: true}]}]}]
    })

    if (!userOrganization) {
        throw new ApolloError('Невозможно получить доступ', 'PERMISSIONS_ERROR')
    }

    const result: Right[] = userOrganization.user_organization_role.reduce((acc: Right[], item: UserOrganizationRole) => {
        return [...acc, ...item.role.rights];
    }, []);

    return result;
}

export function RightDecorator({organizations, desks}: RightDecoratorArgs) {
    const RightMiddleware: MiddlewareFn<MyContext> = async ({context}, next) => {
        const user: User | null = await User.findOne({where: {id: context.payload?.userId}});

        if (!user) {
            throw new ApolloError('Невозможно получить доступ', 'PERMISSIONS_ERROR');
        }

        if (organizations) {
            const rights: Right[] = await getRights({orgId: organizations.id, userId: user.id});
        }

        if (desks) {

        }

        return next();
    }

    return createMethodDecorator(RightMiddleware);
}