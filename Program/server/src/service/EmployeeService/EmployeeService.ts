// Core
import {ApolloError} from "apollo-server-express";

// Args
import {
    GetAllEmployeesInput,
} from "./args";

// Models
import {UserOrganization} from "../../models/UserOrganization";
import {Role} from "../../models/Role";
import {Right} from "../../models/Right";
import {RoleRight} from "../../models/RoleRight";

// Types
import {BeginCondition as BeginConditionTypes, Errors, MyContext, OrganizationRights} from "../../types";
import {BeginCondition} from "../../models/BeginCondition";

class EmployeeService {
    async getAll(ctx: MyContext, {orgId}: GetAllEmployeesInput): Promise<UserOrganization[]> {
        const getAllEmployees = async (): Promise<UserOrganization[]> => {
            const employees: UserOrganization[] | null = await UserOrganization.findAll({
                where: {organization_id: orgId},
                include: [{all: true, include: [{all: true}]}]
            });
            return employees ? employees : [];
        }

        const getEmployeesWithLowerRole = async (): Promise<UserOrganization[]> => {
            const employee: UserOrganization | null = await UserOrganization.findOne({
                where: {
                    organization_id: orgId,
                    user_id: ctx.payload?.userId
                },
                include: [{all: true, include: [{all: true}]}]
            });

            if (!employee) {
                throw new ApolloError('Такого сотрудника не существует', Errors.READ_ERROR);
            }

            const findMaxRating = (employee: UserOrganization): number => {
                return employee.roles.reduce((acc: number, role: Role) => {
                    if (role.rating > acc) {
                        return role.rating
                    } else {
                        return acc
                    }
                }, 0);
            }

            const maxRatingEmployee: number = findMaxRating(employee);

            const employees: UserOrganization[] | null = await UserOrganization.findAll({
                where: {organization_id: orgId},
                include: [{model: Role}]
            });

            const filterEmployees = employees.filter(employee => findMaxRating(employee) > maxRatingEmployee);
            return filterEmployees ? filterEmployees : [];
        }

        const needRight: Right | null = await Right.findOne({where: {code: OrganizationRights.READ_EMPLOYEES}});

        if (!needRight) {
            throw new ApolloError('Такого права не существует', Errors.READ_ERROR);
        }

        const employee: UserOrganization | null = await UserOrganization.findOne({
            where: {
                organization_id: orgId,
                user_id: ctx.payload?.userId
            },
            include: {model: Role, include: [{model: RoleRight, include: [{model: BeginCondition}]}]}
        });

        if (!employee) {
            throw new ApolloError('Такого сотрудника не существует', Errors.READ_ERROR);
        }

        const conditions: BeginConditionTypes[] | null = employee.roles.reduce((acc: BeginConditionTypes[], role) => {
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
                return getAllEmployees();
            }

            const isGetLowerRoles: boolean = conditions.includes(BeginConditionTypes.ONLY_LOWER_STATUS);

            if (isGetLowerRoles) {
                return getEmployeesWithLowerRole();
            }
        }

        return [];
    }

    // async update({orgId, employeeId}: )
}

export default new EmployeeService();