// Core
import {ApolloError} from "apollo-server-express";

// Args
import {
    CheckDistributionArgs,
    CompareRightsArgs,
    ConditionFunctionArgs,
    GetDeskRightsArgs,
    GetOrganizationRightsArgs,
    RoleRight as RoleRightInterface,
    SelectConditionFunctionArgs
} from "./args";

// Types
import {BeginCondition as BeginConditionTypes, ObjectTypes} from "../../types";

// Models
import {UserOrganization} from "../../models/UserOrganization";
import {Role} from "../../models/Role";
import {RoleRight} from "../../models/RoleRight";
import {Right} from "../../models/Right";
import {UserDesk} from "../../models/UserDesk";
import {BeginCondition} from "../../models/BeginCondition";
import {Card} from "../../models/Card";

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
                result = await UserDesk.findOne({where: {desk_id: reqData.options.deskId, user_id: reqData.user.id}});
                return result.is_creator;
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
                result = await UserDesk.findOne({where: {user_id: reqData.user.id, desk_id: reqData.options.deskId}});
                return !!result;
            case ObjectTypes.CARDS_OBJECT:
                result = await Card.findOne({where: {id: reqData.options.cardId}});
                return result.user_id === reqData.user.id;
            default:
                return result;
        }
    }

    async onlyLowerStatusCheck({model, reqData, role}: ConditionFunctionArgs): Promise<boolean> {
        let result: any = true;
        switch (model) {
            case ObjectTypes.ROLES_OBJECT:
                result = await Role.findOne({where: {id: reqData.options.roleId}});
                if (!result) return false;
                return role.rating < result.rating;
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
}

export default new RightService();