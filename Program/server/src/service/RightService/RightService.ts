// Core
import {ApolloError} from "apollo-server-express";
import {Op} from "sequelize";

// Args
import {
    CheckDistributionArgs,
    CompareRightsArgs,
    ConditionFunctionArgs,
    GetDeskRightsArgs, getDeskRolesInput,
    GetOrganizationRightsArgs,
    getOrganizationRolesInput,
    RoleRight as RoleRightInterface,
    SelectConditionFunctionArgs
} from "./args";

// Types
import {BeginCondition as BeginConditionTypes, MyContext, ObjectTypes, PurposeTypes} from "../../types";

// Models
import {UserOrganization} from "../../models/UserOrganization";
import {Role} from "../../models/Role";
import {RoleRight} from "../../models/RoleRight";
import {Right} from "../../models/Right";
import {UserDesk} from "../../models/UserDesk";
import {BeginCondition} from "../../models/BeginCondition";
import {Card} from "../../models/Card";
import {Organization} from "../../models/Ogranization";

class RightService {
    async getOrganizationRights({orgId, userId}: GetOrganizationRightsArgs): Promise<RoleRightInterface[]> {
        const userOrganization: UserOrganization | null = await UserOrganization.findOne({
            where: {
                organization_id: orgId,
                user_id: userId
            },
            include: [{
                model: Role, include: [
                    {
                        model: RoleRight, include: [
                            {
                                model: Right, include: [
                                    {
                                        all: true
                                    }]
                            },
                            {
                                model: BeginCondition
                            },
                        ]
                    }]
            }]
        })

        if (!userOrganization) {
            throw new ApolloError('Невозможно получить доступ', 'PERMISSIONS_ERROR');
        }

        let result: RoleRightInterface[] = userOrganization.roles.reduce((acc: RoleRightInterface[], item: Role) => {
            const rolesRights: RoleRightInterface[] = [];
            item.role_rights.forEach((role_right: RoleRight) => {
                rolesRights.push({
                    data: role_right.right,
                    beginCondition: role_right.begin_condition?.code,
                    role: item
                });
            });
            return [...acc, ...rolesRights];
        }, []);

        return result;
    }

    async getDeskRights({deskId, userId}: GetDeskRightsArgs): Promise<RoleRightInterface[]> {
        const userDesk: UserDesk | null = await UserDesk.findOne({
            where: {
                desk_id: deskId,
                user_id: userId
            },
            include: [{
                model: Role, include: [
                    {
                        model: RoleRight, include: [
                            {
                                model: Right, include: [
                                    {
                                        all: true
                                    }]
                            },
                            {
                                model: BeginCondition
                            },
                        ]
                    }]
            }]
        })

        if (!userDesk) {
            throw new ApolloError('Невозможно получить доступ', 'PERMISSIONS_ERROR');
        }

        let result: RoleRightInterface[] = userDesk.roles.reduce((acc: RoleRightInterface[], item: Role) => {
            const rolesRights: RoleRightInterface[] = [];
            item.role_rights.forEach((role_right: RoleRight) => {
                rolesRights.push({
                    data: role_right.right,
                    beginCondition: role_right.begin_condition?.code,
                    role: item
                });
            });
            return [...acc, ...rolesRights];
        }, []);

        return result;
    }

    async onlyTheirCheck({model, reqData}: ConditionFunctionArgs): Promise<boolean> {
        let result: any = true;
        switch (model) {
            case ObjectTypes.DESKS_OBJECT:
                if (reqData.options.deskId) {
                    result = await UserDesk.findOne({
                        where: {
                            desk_id: reqData.options.deskId,
                            user_id: reqData.user.id
                        }
                    });
                    return result.is_creator;
                } else {
                    return true
                }
            case ObjectTypes.CARDS_OBJECT:
                result = await Card.findOne({where: {id: reqData.options.cardId}});
                // TODO выбрать создателя карточки
                return true;
                // return result.;
            default:
                return result;
        }
    }

    async onlyPinCheck({model, reqData}: ConditionFunctionArgs): Promise<boolean> {
        let result: any = true;
        switch (model) {
            case ObjectTypes.DESKS_OBJECT:
                if (reqData.options.deskId) {
                    result = await UserDesk.findOne({
                        where: {
                            user_id: reqData.user.id,
                            desk_id: reqData.options.deskId
                        }
                    });
                    return !!result;
                } else {
                    return result;
                }
            case ObjectTypes.CARDS_OBJECT:
                if (reqData.options.cardId) {
                    result = await Card.findOne({where: {id: reqData.options.cardId}});
                    return result.user_id === reqData.user.id;
                } else {
                    return result;
                }
            default:
                return result;
        }
    }

    async onlyLowerStatusCheck({model, reqData, role}: ConditionFunctionArgs): Promise<boolean> {
        let result: any = true;
        switch (model) {
            case ObjectTypes.ROLES_OBJECT:
                if (reqData.options.roleId) {
                    result = await Role.findOne({where: {id: reqData.options.roleId}});
                    if (!result) return false;
                    return role.rating < result.rating;
                } else {
                    return result;
                }
            default:
                return result;
        }
    }

    selectConditionFunction({condition}: SelectConditionFunctionArgs): Function | null {
        switch (condition) {
            case BeginConditionTypes.ONLY_THEIR:
                return this.onlyTheirCheck;
            case BeginConditionTypes.ONLY_PIN:
                return this.onlyPinCheck;
            case BeginConditionTypes.ONLY_LOWER_STATUS:
                return this.onlyLowerStatusCheck;
            default:
                return null;
        }
    }

    async checkCondition({reqData, roleRight: {beginCondition, data, role}}: CheckDistributionArgs): Promise<boolean> {
        if (beginCondition) {
            const conditionFunction: Function | null = this.selectConditionFunction({condition: beginCondition});

            reqData.context.conditions ? reqData.context.conditions.push(beginCondition) : reqData.context.conditions = [beginCondition];

            if (!conditionFunction) return true;

            switch (data.object.code) {
                case ObjectTypes.DESKS_OBJECT:
                    return await conditionFunction({model: ObjectTypes.DESKS_OBJECT, reqData, role});
                case ObjectTypes.ROLES_OBJECT:
                    return await conditionFunction({model: ObjectTypes.ROLES_OBJECT, reqData, role});
                case ObjectTypes.CARDS_OBJECT:
                    return await conditionFunction({model: ObjectTypes.CARDS_OBJECT, reqData, role});
                default:
                    return true;
            }
        }

        return true;
    }

    async compareRights({haveRights, needRights, reqData}: CompareRightsArgs): Promise<boolean> {
        const needRightsWithParent: string[] = [...needRights];

        while (needRightsWithParent.length) {
            const haveRight: RoleRightInterface[] | undefined = haveRights.filter(haveRight => needRightsWithParent[needRightsWithParent.length - 1] === haveRight.data.code);
            if (!haveRight) return false;
            let result: boolean = false;

            for (let i = 0; i < haveRight.length; i++) {
                const checkCondition: boolean = await this.checkCondition({roleRight: haveRight[i], reqData});
                if (checkCondition) {
                    needRightsWithParent.pop();
                    if (haveRight[i].data.parent) needRightsWithParent.push(haveRight[i].data.parent.code);
                    result = true;
                    break;
                }
            }

            if (!result) return false;
        }

        return true;
    }

    async getOrganizationRolesInput({
                                        conditions,
                                        payload
                                    }: MyContext, {orgId}: getOrganizationRolesInput): Promise<Role[] | null> {
        const getAllRoles = async (): Promise<Role[]> => {
            const organization: Organization | null = await Organization.findOne({
                where: {id: orgId},
                include: [{model: Role, where: {purpose_id: PurposeTypes.organization}}]
            });

            if (organization) {
                return organization.roles;
            } else {
                throw new ApolloError('Организация не найдена', 'FIND_ERROR');
            }
        }

        const getLowerRoles = async (): Promise<Role[] | null> => {
            const userOrganization: UserOrganization | null = await UserOrganization.findOne({
                where: {organization_id: orgId, user_id: payload?.userId},
                include: [{
                    model: Role, where: {
                        purpose_id: PurposeTypes.organization
                    }
                }]
            })

            if (!userOrganization) throw new ApolloError('Организация не найдена', 'FIND_ERROR');

            const roleWithMaxRating: Role = userOrganization.roles.sort((a, b) => a.rating - b.rating)[0];
            const organization: Organization | null = await Organization.findOne({
                where: {id: orgId},
                include: [{
                    model: Role, where: {
                        purpose_id: PurposeTypes.organization, rating: {
                            [Op.gt]: roleWithMaxRating.rating,
                        }
                    }
                }]
            });

            if (organization) {
                return organization.roles;
            } else {
                throw new ApolloError('Организация не найдена', 'FIND_ERROR');
            }
        }

        if (conditions) {
            const isGetAll: boolean = conditions.includes(BeginConditionTypes.ALL);

            if (isGetAll) {
                return getAllRoles();
            }

            const isGetLowerRoles: boolean = conditions.includes(BeginConditionTypes.ONLY_LOWER_STATUS);

            if (isGetLowerRoles) {
                return getLowerRoles();
            }

            return null;
        }

        return null;
    }

    async getDeskRolesInput({conditions, payload}: MyContext, {orgId}: getDeskRolesInput): Promise<Role[] | null> {
        const getAllRoles = async (): Promise<Role[]> => {
            const organization: Organization | null = await Organization.findOne({
                where: {id: orgId},
                include: [{model: Role, where: {purpose_id: PurposeTypes.desk}}]
            });

            if (organization) {
                return organization.roles;
            } else {
                throw new ApolloError('Организация не найдена', 'FIND_ERROR');
            }
        }

        if (conditions) {
            const isGetAll: boolean = conditions.includes(BeginConditionTypes.ALL);

            if (isGetAll) {
                return getAllRoles();
            }

            return null;
        }

        return null;
    }
}

export default new RightService();