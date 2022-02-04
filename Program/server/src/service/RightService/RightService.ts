// Core
import {ApolloError} from "apollo-server-express";

// Args
import {
    AddRolesRightArgs,
    CheckDistributionArgs,
    CompareRightsArgs,
    ConditionFunctionArgs,
    GetAllRightsByObjectInput,
    GetDeskRightsArgs,
    GetOrganizationRightsArgs,
    ObjectData,
    RoleRight as RoleRightInterface,
    SelectConditionFunctionArgs
} from "./args";

// Types
import {BeginCondition as BeginConditionTypes, Errors, ObjectTypes, PurposeTypes} from "../../types";

// Models
import {UserOrganization} from "../../models/UserOrganization";
import {Role} from "../../models/Role";
import {RoleRight} from "../../models/RoleRight";
import {Right} from "../../models/Right";
import {UserDesk} from "../../models/UserDesk";
import {BeginCondition} from "../../models/BeginCondition";
import {Card} from "../../models/Card";

class RightService {
    async getUserOrganizationRights({orgId, userId}: GetOrganizationRightsArgs): Promise<RoleRightInterface[]> {
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

    async getAllOrganizationRights(): Promise<Right[]> {
        const rights: Right[] | null = await Right.findAll({
            where: {purpose_id: PurposeTypes.organization},
            include: [{all: true}]
        });

        if (!rights) {
            throw new ApolloError('Таких прав нет', Errors.READ_ERROR);
        }

        return rights;
    }

    async getAllDeskRights(): Promise<Right[]> {
        const rights: Right[] | null = await Right.findAll({
            where: {purpose_id: PurposeTypes.desk},
            include: {all: true}
        });

        if (!rights) {
            throw new ApolloError('Таких прав нет', Errors.READ_ERROR);
        }

        return rights;
    }

    async getUserDeskRights({deskId, userId}: GetDeskRightsArgs): Promise<RoleRightInterface[]> {
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

            if (!conditionFunction) return true;

            switch (data.object.code) {
                case ObjectTypes.DESKS_OBJECT:
                    return await conditionFunction({model: ObjectTypes.DESKS_OBJECT, reqData, role});
                case ObjectTypes.ROLES_OBJECT:
                    return await conditionFunction({model: ObjectTypes.ROLES_OBJECT, reqData, role});
                case ObjectTypes.CARDS_OBJECT:
                    return await conditionFunction({model: ObjectTypes.CARDS_OBJECT, reqData, role});
                case ObjectTypes.LABELS_OBJECT:
                    return await conditionFunction({model: ObjectTypes.LABELS_OBJECT, reqData, role});
                case ObjectTypes.EMPLOYEES_OBJECT:
                    return await conditionFunction({model: ObjectTypes.EMPLOYEES_OBJECT, reqData, role});
                case ObjectTypes.COLUMN_OBJECT:
                    return await conditionFunction({model: ObjectTypes.COLUMN_OBJECT, reqData, role});
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

    async addRoleRights({roleId, rights}: AddRolesRightArgs): Promise<boolean> {
        try {
            for (let i = 0; i < rights.length; i++) {
                await RoleRight.create({
                    role_id: roleId,
                    right_id: rights[i].rightId,
                    begin_condition_id: rights[i].begin_condition
                })
            }
            return true;
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }
    }

    async getAllRightsByObject({object}: GetAllRightsByObjectInput): Promise<ObjectData[]> {
        let rights: Right[] = [];
        let result: ObjectData[] = [];
        switch (object) {
            case ObjectTypes.ORGANIZATION_OBJECT:
                rights = await this.getAllOrganizationRights();
                break;
            case ObjectTypes.DESKS_OBJECT:
                rights = await this.getAllDeskRights();
                break;
            default:
                throw new ApolloError('Прав для такого объекта не существует', Errors.READ_ERROR)
        }

        const parentRights: any = rights.filter(right => !right.parent);
        const childRights: any = rights.filter(right => right.parent);

        result = parentRights.reduce((acc: ObjectData[], parentRight: Right) => {
            const candidate: ObjectData | undefined = acc.find(a => a.code === parentRight.object.code);

            parentRight.beginConditions.push({code: BeginConditionTypes.NO, name: 'Нет'} as BeginCondition)
            parentRight.children = [];

            if (candidate) {
                candidate.rights.push(parentRight);
                return acc;
            }

            acc.push({
                name: parentRight.object.name,
                code: parentRight.object.code,
                rights: [parentRight],
            })

            return acc;
        }, []);

        childRights.forEach((childRight: Right) => {
            const parent: Right | undefined = result.find(a => a.code === childRight.object.code)?.rights.find(a => a.code === childRight.parent.code);
            childRight.beginConditions.push({code: BeginConditionTypes.NO, name: 'Нет'} as BeginCondition)
            parent?.children.push(childRight);
        })

        return result;
    }
}

export default new RightService();