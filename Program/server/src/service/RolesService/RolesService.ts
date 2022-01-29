// Core
import {ApolloError} from "apollo-server-express";
import {Op} from "sequelize";

// Args
import {CreateDefaultRoleArgs, GetDeskRolesInput, GetOrganizationRolesInput} from "./args";

// Types
import {
    BeginCondition as BeginConditionTypes,
    DefaultRoles, DesksRights,
    Errors,
    MyContext,
    OrganizationRights,
    PurposeTypes
} from "../../types";

// Models
import {UserOrganization} from "../../models/UserOrganization";
import {Role} from "../../models/Role";
import {Organization} from "../../models/Ogranization";
import {Right} from "../../models/Right";
import {BeginCondition} from "../../models/BeginCondition";

// Service
import RightService from "../RightService/RightService";
import {RoleRight} from "../../models/RoleRight";

class RolesService {
    async getOrganizationRolesInput({payload}: MyContext, {orgId}: GetOrganizationRolesInput): Promise<Role[] | null> {
        const getAllRoles = async (): Promise<Role[]> => {
            const organization: Organization | null = await Organization.findOne({
                where: {id: orgId},
                include: [{model: Role, where: {purpose_id: PurposeTypes.organization}}]
            });

            if (organization) {
                return organization.roles;
            } else {
                throw new ApolloError('Организация не найдена', Errors.READ_ERROR);
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

            if (!userOrganization) throw new ApolloError('Организация не найдена', Errors.READ_ERROR);

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
                throw new ApolloError('Организация не найдена', Errors.READ_ERROR);
            }
        }

        if (!payload?.userId) {
            throw new ApolloError('Ошибка авторизации', Errors.TOKEN_ERROR);
        }

        const userOrganization: UserOrganization | null = await UserOrganization.findOne({
            where: {
                user_id: payload.userId,
                organization_id: orgId
            }, include: {model: Role, include: [{model: RoleRight, include: [{model: BeginCondition}]}]}
        })

        if (!userOrganization) {
            throw new ApolloError('Нет прав для доступа к данной организации', Errors.PERMISSIONS_ERROR);
        }

        const needRight: Right | null = await Right.findOne({where: {code: OrganizationRights.READ_ORGANIZATION_ROLES}});

        if (!needRight) {
            throw new ApolloError('Такого права не существует', Errors.READ_ERROR);
        }

        const conditions: BeginConditionTypes[] | null = userOrganization.roles.reduce((acc: BeginConditionTypes[], role) => {
            const findRight: RoleRight | undefined = role.role_rights.find(roleRight => roleRight.right_id === needRight.id);
            if (findRight) {
                return [...acc, findRight.begin_condition.code]
            } else {
                return acc
            }
        }, []);

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

    async getDeskRolesInput({payload}: MyContext, {orgId}: GetDeskRolesInput): Promise<Role[] | null> {
        const getAllRoles = async (): Promise<Role[]> => {
            const organization: Organization | null = await Organization.findOne({
                where: {id: orgId},
                include: [{model: Role, where: {purpose_id: PurposeTypes.desk}}]
            });

            if (organization) {
                return organization.roles;
            } else {
                throw new ApolloError('Организация не найдена', Errors.READ_ERROR);
            }
        }

        // TODO вынести в отдельный метод
        if (!payload?.userId) {
            throw new ApolloError('Ошибка авторизации', Errors.TOKEN_ERROR);
        }

        const userOrganization: UserOrganization | null = await UserOrganization.findOne({
            where: {
                user_id: payload.userId,
                organization_id: orgId
            }, include: {model: Role, include: [{model: RoleRight, include: [{model: BeginCondition}]}]}
        })

        if (!userOrganization) {
            throw new ApolloError('Нет прав для доступа к данной организации', Errors.PERMISSIONS_ERROR);
        }

        const needRight: Right | null = await Right.findOne({where: {code: OrganizationRights.READ_DESK_ROLES}});

        if (!needRight) {
            throw new ApolloError('Такого права не существует', Errors.READ_ERROR);
        }

        const conditions: BeginConditionTypes[] | null = userOrganization.roles.reduce((acc: BeginConditionTypes[], role) => {
            const findRight: RoleRight | undefined = role.role_rights.find(roleRight => roleRight.right_id === needRight.id);
            if (findRight) {
                return [...acc, findRight.begin_condition.code]
            } else {
                return acc
            }
        }, []);

        if (conditions) {
            const isGetAll: boolean = conditions.includes(BeginConditionTypes.ALL);

            if (isGetAll) {
                return getAllRoles();
            }

            return null;
        }

        return null;
    }

    async createDefaultRole({role, orgId}: CreateDefaultRoleArgs): Promise<Role> {
        switch (role) {
            case DefaultRoles.EMPLOYEE: {
                const role: Role = await Role.create({
                    name: DefaultRoles.EMPLOYEE,
                    rating: 1,
                    purpose_id: PurposeTypes.organization,
                    organization_id: orgId
                });
                await RightService.addRoleRights({
                    roleId: role.id, rights: [
                        {rightId: 1, begin_condition: 3},
                    ]
                });
                return role;
            }
            case DefaultRoles.EXECUTOR: {
                const role: Role = await Role.create({
                    name: DefaultRoles.EXECUTOR,
                    rating: 1,
                    purpose_id: PurposeTypes.desk,
                    organization_id: orgId
                });
                await RightService.addRoleRights({
                    roleId: role.id, rights: []
                });
                return role;
            }
            case DefaultRoles.ORGANIZATION_OWNER: {
                const role: Role = await Role.create({
                    name: DefaultRoles.ORGANIZATION_OWNER,
                    rating: 1,
                    purpose_id: PurposeTypes.organization,
                    organization_id: orgId
                });

                const rights: Right[] | null = await RightService.getAllOrganizationRights();
                const beginConditions: BeginCondition[] | null = await BeginCondition.findAll();

                if (rights && beginConditions) {
                    await RightService.addRoleRights({
                        roleId: role.id, rights: rights.map(right => {
                            switch (right.code) {
                                case OrganizationRights.READ_DESK:
                                case OrganizationRights.READ_LABELS:
                                case OrganizationRights.READ_ORGANIZATION_ROLES:
                                    return {
                                        rightId: right.id,
                                        begin_condition: beginConditions.find(condition => condition.code === BeginConditionTypes.ALL)!.id
                                    };
                                default:
                                    return {
                                        rightId: right.id,
                                        begin_condition: beginConditions.find(condition => condition.code === BeginConditionTypes.YES)!.id
                                    };
                            }
                        })
                    })
                }
                return role;
            }
            case DefaultRoles.DESK_OWNER: {
                const role: Role = await Role.create({
                    name: DefaultRoles.DESK_OWNER,
                    rating: 1,
                    purpose_id: PurposeTypes.desk,
                    organization_id: orgId
                });

                const rights: Right[] | null = await RightService.getAllDeskRights();
                const beginConditions: BeginCondition[] | null = await BeginCondition.findAll();

                if (rights && beginConditions) {
                    await RightService.addRoleRights({
                        roleId: role.id, rights: rights.map(right => {
                            switch (right.code) {
                                case DesksRights.READ_ROLES_ON_DESK:
                                    return {
                                        rightId: right.id,
                                        begin_condition: beginConditions.find(condition => condition.code === BeginConditionTypes.ALL)!.id
                                    };
                                default:
                                    return {
                                        rightId: right.id,
                                        begin_condition: beginConditions.find(condition => condition.code === BeginConditionTypes.YES)!.id
                                    };
                            }
                        })
                    })
                }
                return role;
            }
        }
    }
}

export default new RolesService();