// Core
import {ApolloError} from "apollo-server-express";
import {v4} from "uuid";

// Args
import {
    GetAllEmployeesInput,
    GetOneEmployeeInput,
    AddEmployeeInput,
    AddEmployeeResponse,
    UpdateEmployeeInput,
    UpdateEmployeeResponse,
    InviteUserOrganizationInput,
    InviteUserOrganizationResponse,
    DeleteEmployeeInput,
    DeleteEmployeeResponse,
} from "./args";

// Models
import {UserOrganization} from "../../models/UserOrganization";
import {Role} from "../../models/Role";
import {Right} from "../../models/Right";
import {RoleRight} from "../../models/RoleRight";
import {Label} from "../../models/Label";
import {BeginCondition} from "../../models/BeginCondition";
import {UserLabel} from "../../models/UserLabel";
import {UserOrganizationRole} from "../../models/UserOrganizationRole";
import {User} from "../../models/User";
import {Organization} from "../../models/Ogranization";

// Types
import {BeginCondition as BeginConditionTypes, Errors, MyContext, OrganizationRights} from "../../types";

// Constants
import {INVITE_USER_ORGANIZATION_PREFIX} from "../../init/config/constants";

// Service
import MailService from "../MailService/MailService";

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

    async getOne({employeeId}: GetOneEmployeeInput): Promise<UserOrganization> {
        const employee: UserOrganization | null = await UserOrganization.findOne({where: {id: employeeId}});

        if (!employee) {
            throw new ApolloError('Такого сотрудника не существует', Errors.READ_ERROR);
        }

        return employee;
    }

    async inviteUser({cache}: MyContext, {
        orgId,
        userId,
        experience,
        roles,
        isVacation,
        hourlyRate
    }: InviteUserOrganizationInput): Promise<InviteUserOrganizationResponse> {
        const user: User | null = await User.findOne({where: {id: userId}});
        const organization: Organization | null = await Organization.findOne({where: {id: orgId}});

        if (!user) {
            throw new ApolloError('Такого пользователя больше не существует', Errors.READ_ERROR);
        }

        if (!organization) {
            throw new ApolloError('Такой организации больше не существует', Errors.READ_ERROR)
        }

        const token: string = v4();
        cache.set(INVITE_USER_ORGANIZATION_PREFIX + token, {
            userId,
            orgId,
            experience,
            roles,
            isVacation,
            hourlyRate
        }, 1000 * 60 * 60 * 24 * 2);

        await MailService.sendMail({
            to: user.email,
            html: `<a href='http://localhost:3000/user/invite-desk/${token}'>Вас приглашают в организацию ${organization.name}</a>`,
            subject: 'Приглашение на доску'
        });

        return {
            message: `Письмо приглашения отправлено на почту ${user.email}`,
        };
    }

    async add({cache}: MyContext, {token}: AddEmployeeInput): Promise<AddEmployeeResponse> {
        const data: { orgId: number, userId: number, experience: number, hourlyRate: number, isVacation: boolean, roles: number[] } | undefined = cache.get(INVITE_USER_ORGANIZATION_PREFIX + token);

        if (!data) {
            throw new ApolloError('Время доступа истекло', Errors.TOKEN_ERROR);
        }

        try {
            const userOrganization: UserOrganization | null = await UserOrganization.create({
                organization_id: data.orgId,
                user_id: data.userId,
                experience: data.experience,
                hourly_rate: data.hourlyRate,
                is_vacation: data.isVacation
            })

            if (data.roles) {
                for (let i = 0; i < data.roles.length; i++) {
                    await UserOrganizationRole.create({
                        role_id: data.roles[i],
                        user_organization_id: userOrganization.id
                    });
                }
            }
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }

        return {
            message: 'Вы успешно присоединились к организации'
        }
    }

    async delete({orgId, employeeId}: DeleteEmployeeInput): Promise<DeleteEmployeeResponse> {
        const employee: UserOrganization | null = await UserOrganization.findOne({where: {id: employeeId}});

        if (!employee) {
            throw new ApolloError('Такого сотрудника не существует', Errors.READ_ERROR);
        }

        try {
            await employee.destroy();
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }

        return {
            message: 'Сотрудник успешно удален'
        }
    }

    async update({
                     orgId,
                     employeeId,
                     hourlyRate,
                     labels,
                     experience,
                     roles,
                     isVacation
                 }: UpdateEmployeeInput): Promise<UpdateEmployeeResponse> {
        const employee: UserOrganization | null = await UserOrganization.findOne({where: {id: employeeId}});

        if (!employee) {
            throw new ApolloError('Такого сотрудника не существует', Errors.READ_ERROR);
        }

        try {
            await employee.update({hourly_rate: hourlyRate, experience, is_vacation: isVacation});
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }

        if (labels) {
            const userLabels: UserLabel[] | null = await UserLabel.findAll({
                where: {user_id: employee.user_id},
                include: [{model: Label}]
            });
            let employeeLabels: Label[] = userLabels.reduce((acc: Label[], userLabel: UserLabel) => {
                if (userLabel.label.organization_id === orgId) {
                    return [...acc, userLabel.label];
                }
                return acc;
            }, []);

            for (let i = 0; i < labels.length; i++) {
                const index: number = employeeLabels.findIndex((employeeLabel: Label) => employeeLabel.id === labels[i]);
                if (index === -1) {
                    const label: Label | null = await Label.findOne({where: {id: labels[i]}});

                    if (!label) {
                        throw new ApolloError('Такого лейбла не существует', Errors.READ_ERROR);
                    }

                    if (label.organization_id !== orgId) {
                        throw new ApolloError('Этот лейбл невомзожно присоединить к сотруднику', Errors.PERMISSIONS_ERROR);
                    }

                    await UserLabel.create({user_id: employee.user_id, label_id: labels[i]});
                } else {
                    employeeLabels = [...employeeLabels.slice(0, index), ...employeeLabels.slice(index + 1, employeeLabels.length)];
                }
            }

            for (let i = 0; i < employeeLabels.length; i++) {
                const userLabel: UserLabel | null = await UserLabel.findOne({
                    where: {
                        user_id: employee.user_id,
                        label_id: employeeLabels[i].id
                    }
                })
                if (userLabel) await userLabel.destroy();
            }
        }

        if (roles) {
            const userOrganizationRoles: UserOrganizationRole[] | null = await UserOrganizationRole.findAll({
                where: {user_organization_id: employeeId},
                include: [{model: Role}]
            });
            let employeeRoles: Role[] = userOrganizationRoles.reduce((acc: Role[], userOrganizationRole: UserOrganizationRole) => {
                if (userOrganizationRole.role.organization_id === orgId) {
                    return [...acc, userOrganizationRole.role];
                }
                return acc;
            }, []);

            for (let i = 0; i < roles.length; i++) {
                const index: number = employeeRoles.findIndex((employeeRole: Role) => employeeRole.id === roles[i]);
                if (index === -1) {
                    const role: Role | null = await Role.findOne({where: {id: roles[i]}});

                    if (!role) {
                        throw new ApolloError('Такого лейбла не существует', Errors.READ_ERROR);
                    }

                    if (role.organization_id !== orgId) {
                        throw new ApolloError('Эту роль невомзожно присоединить к сотруднику', Errors.PERMISSIONS_ERROR);
                    }

                    await UserOrganizationRole.create({user_organization_id: employee.id, role_id: roles[i]});
                } else {
                    employeeRoles = [...employeeRoles.slice(0, index), ...employeeRoles.slice(index + 1, employeeRoles.length)];
                }
            }

            for (let i = 0; i < employeeRoles.length; i++) {
                await UserOrganizationRole.destroy({where: {id: employeeRoles[i].id}});
            }
        }

        return {
            message: 'Данные о сотруднике успешно обновлены'
        }
    }
}

export default new EmployeeService();