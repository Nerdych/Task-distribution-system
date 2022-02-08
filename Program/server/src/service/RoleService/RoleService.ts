// Core
import {ApolloError} from "apollo-server-express";
import {Op} from "sequelize";

// Args
import {
    CreateDefaultRoleArgs,
    GetDeskRolesInput,
    GetOrganizationRolesInput,
    CreateRoleInput,
    CreateRoleResponse, UpdateRoleInput, UpdateRoleResponse, DeleteRoleInput, DeleteRoleResponse
} from "./args";

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
import {RoleRight} from "../../models/RoleRight";

// Service
import RightService from "../RightService/RightService";

class RoleService {
    async getOrganizationRoles({payload}: MyContext, {orgId}: GetOrganizationRolesInput): Promise<Role[] | null> {
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

    async getDeskRoles({payload}: MyContext, {orgId}: GetDeskRolesInput): Promise<Role[] | null> {
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
                    rating: 0,
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
                    rating: 0,
                    purpose_id: PurposeTypes.desk,
                    organization_id: orgId
                });

                const rights: Right[] | null = await RightService.getAllDeskRights();
                const beginConditions: BeginCondition[] | null = await BeginCondition.findAll();

                if (rights && beginConditions) {
                    await RightService.addRoleRights({
                        roleId: role.id, rights: rights.map(right => {
                            switch (right.code) {
                                case DesksRights.READ_DESK_EMPLOYEES:
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

    async create({orgId, rights, purposeId, rating, name}: CreateRoleInput): Promise<CreateRoleResponse> {
        const role: Role = await Role.create({name, rating, purpose_id: purposeId!, organization_id: orgId});

        for (let i = 0; i < rights.length; i++) {
            const right: Right | null = await Right.findOne({where: {id: rights[i].id}, include: [{all: true}]});

            if (!right) {
                throw new ApolloError('Такого права не существует', Errors.READ_ERROR);
            }

            if (right.purpose_id !== purposeId) {
                throw new ApolloError('Невозможно добавить данное право к данной роли', Errors.SOMETHING_ERROR);
            }

            if (!right.beginConditions.find(beginCondition => beginCondition.id === rights[i].beginConditionId)) {
                throw new ApolloError('Невозможно добавить данное значение к данной роли', Errors.SOMETHING_ERROR);
            }

            await RoleRight.create({
                role_id: role.id,
                right_id: rights[i].id,
                begin_condition_id: rights[i].beginConditionId
            });
        }


        return {
            message: 'Роль успешна создана'
        }
    }

    async update({name, rating, rights, purposeId, roleId}: UpdateRoleInput): Promise<UpdateRoleResponse> {
        const role: Role | null = await Role.findOne({where: {id: roleId}});

        if (!role) {
            throw new ApolloError('Такой роли не существует', Errors.READ_ERROR);
        }

        const updateObj: { name?: string, rating?: number } = {};

        if (name) {
            updateObj.name = name;
        }

        if (rating) {
            updateObj.rating = rating;
        }

        try {
            await role.update(updateObj);
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }

        if (rights) {
            for (let i = 0; i < rights.length; i++) {
                const right: Right | null = await Right.findOne({
                    where: {id: rights[i].id},
                    include: [{all: true}]
                });

                if (!right) {
                    throw new ApolloError('Такого права не существует', Errors.READ_ERROR);
                }

                // TODO если пэрэнта нет а мы пытаемся изменить ребенка
                // if (right.parent) {
                //     if (!role.rights.find(a => a.code === right.parent.code)) {
                //         throw new ApolloError('Невозможно добавить данное право к данной роли', Errors.SOMETHING_ERROR);
                //     }
                // }

                if (right.purpose_id !== purposeId) {
                    throw new ApolloError('Невозможно добавить данное право к данной роли', Errors.SOMETHING_ERROR);
                }

                if (!right.beginConditions.find(beginCondition => beginCondition.id === rights[i].beginConditionId) && rights[i].beginConditionId) {
                    throw new ApolloError('Невозможно добавить данное значение к данной роли', Errors.SOMETHING_ERROR);
                }

                const roleRight: RoleRight | null = await RoleRight.findOne({
                    where: {
                        role_id: roleId,
                        right_id: right.id
                    }
                });

                if (roleRight) {
                    if (!rights[i].beginConditionId) {
                        await roleRight.destroy();
                    } else {
                        await roleRight.update({begin_condition_id: rights[i].beginConditionId});
                    }
                } else {
                    await RoleRight.create({
                        role_id: role.id,
                        right_id: rights[i].id,
                        begin_condition_id: rights[i].beginConditionId!
                    });
                }
            }
        }

        return {
            message: 'Роль успешна обновлена'
        }
    }

    async delete({roleId}: DeleteRoleInput): Promise<DeleteRoleResponse> {
        const role: Role | null = await Role.findOne({where: {id: roleId}});

        if (!role) {
            throw new ApolloError('Такой роли не существует', Errors.READ_ERROR);
        }

        await role.destroy();

        return {
            message: 'Роль успешна удалена'
        }
    }
}

export default new RoleService();