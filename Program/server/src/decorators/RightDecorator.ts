// Core
import {ApolloError} from "apollo-server-express";
import {createMethodDecorator} from "type-graphql";
import {MiddlewareFn} from "type-graphql/dist/interfaces/Middleware";

// Types
import {DesksRights, MyContext, OrganizationRights} from "../types";

// Helpers
import {containsArr} from "../helpers/containsArr";

// Models
import {User} from "../models/User";
import {UserOrganization} from "../models/UserOrganization";
import {Right} from "../models/Right";
import {UserOrganizationRole} from "../models/UserOrganizationRole";
import {UserDesk} from "../models/UserDesk";
import {UserDeskRole} from "../models/UserDeskRole";

interface RightDecoratorArgs {
    organizationRights?: OrganizationRights[],
    deskRights?: DesksRights[],
}

interface getOrganizationRightsArgs {
    orgId: number;
    userId: number;
}

interface getDeskRightsArgs {
    deskId: number;
    userId: number;
}

type Rights = OrganizationRights | DesksRights;

const getOrganizationRights = async ({orgId, userId}: getOrganizationRightsArgs): Promise<Right[]> => {
    const userOrganization: UserOrganization[] | null = await UserOrganization.findAll({
        where: {
            organization_id: orgId,
            user_id: userId
        }, include: [{all: true, include: [{all: true, include: [{all: true, include: [{all: true}]}]}]}]
    })

    if (!userOrganization) {
        throw new ApolloError('Невозможно получить доступ', 'PERMISSIONS_ERROR');
    }

    const result: Right[] = userOrganization.reduce((acc: Right[], item: UserOrganization) => {
        const roleRights: Right[] = item.user_organization_role.reduce((acc: Right[], item: UserOrganizationRole) => {
            return [...acc, ...item.role.rights];
        }, []);

        return [...acc, ...roleRights];
    }, []);

    return result;
}

const getDeskRights = async ({deskId, userId}: getDeskRightsArgs): Promise<Rights[]> => {
    const userDesk: UserDesk | null = await UserDesk.findOne({
        where: {
            desk_id: deskId,
            user_id: userId
        }, include: [{all: true, include: [{all: true, include: [{all: true}]}]}]
    })

    if (!userDesk) {
        throw new ApolloError('Невозможно получить доступ', 'PERMISSIONS_ERROR');
    }

    const result: Rights[] = userDesk.user_desk_role.reduce((acc: Right[], item: UserDeskRole) => {
        return [...acc, ...item.role.rights];
    }, []).map(item => item.code);

    return result;
}

const checkDistribution = (right: Right): boolean => {
    return true;
    if (right.roleRights) {

    }
}

const checkAdditionalRight = (right: Right): boolean => {
    if (!right.parent) {

    }
    return checkAdditionalRight(right.parent);
}

const compareRights = (haveRights: Right[], needRights: string[]): boolean => {
    const needRightsWithParent: string[] = [...needRights];
    while (needRightsWithParent.length) {
        const haveRight: Right | undefined = haveRights.find(haveRight => needRightsWithParent[needRightsWithParent.length - 1] === haveRight.code);
        if (!haveRight) return false;
        if (checkDistribution(haveRight)) needRightsWithParent.pop();
        if (haveRight.parent) needRightsWithParent.push(haveRight.parent.code);
    }

    return true;
};

export function RightDecorator({organizationRights, deskRights}: RightDecoratorArgs) {
    const RightMiddleware: MiddlewareFn<MyContext> = async ({context, args}, next) => {
        const user: User | null = await User.findOne({where: {id: context.payload?.userId}});

        if (!user) {
            throw new ApolloError('Невозможно получить доступ', 'PERMISSIONS_ERROR');
        }

        if (organizationRights) {
            const userOrganizationRights: Right[] = await getOrganizationRights({
                orgId: args.options.orgId,
                userId: user.id
            });
            compareRights(userOrganizationRights, organizationRights);
            // if (!containsArr(organizationRights, userOrganizationRights)) {
            //     throw new ApolloError('Невозможно получить доступ', 'PERMISSIONS_ERROR');
            // }
        }

        if (deskRights) {
            const userDesksRights: Rights[] = await getDeskRights({
                deskId: args.options.deskId,
                userId: user.id
            });
            if (!containsArr(deskRights, userDesksRights)) {
                throw new ApolloError('Невозможно получить доступ', 'PERMISSIONS_ERROR');
            }
        }

        return next();
    }

    return createMethodDecorator(RightMiddleware);
}