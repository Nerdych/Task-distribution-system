// Args
import {ApolloError} from "apollo-server-express";
import {v4} from "uuid";

// Types
import {
    BeginCondition as BeginConditionTypes,
    DefaultRoles, DesksRights,
    Errors,
    MyContext,
    OrganizationRights,
    PurposeTypes
} from "../../types";

// Constants
import {INVITE_USER_DESK_PREFIX} from "../../init/config/constants";

// Service
import MailService from "../MailService/MailService";

// Models
import {Desk} from "../../models/Desk";
import {UserDesk} from "../../models/UserDesk";
import {Role} from "../../models/Role";
import {UserDeskRole} from "../../models/UserDeskRole";
import {Organization} from "../../models/Ogranization";
import {User} from "../../models/User";
import {UserOrganization} from "../../models/UserOrganization";
import {Right} from "../../models/Right";
import {RoleRight} from "../../models/RoleRight";
import {BeginCondition} from "../../models/BeginCondition";

// Args
import {
    AddUserDeskInput,
    AddUserDeskResponse, ChangeEmployeeRolesInput, ChangeEmployeeRolesResponse,
    CreateDeskInput,
    CreateDeskResponse,
    DeleteDeskInput,
    DeleteDeskResponse, GetDeskEmployeesInput,
    GetDeskInput,
    GetDesksInput,
    InviteDeskInput,
    InviteDeskResponse,
    UpdateDeskInput
} from "./args";
import {Message} from "../../models/Message";

class DeskService {
    async getDesks({payload}: MyContext, {orgId}: GetDesksInput): Promise<Desk[] | null> {
        const getAllDesks = async (): Promise<Desk[] | null> => {
            const organization: Organization | null = await Organization.findOne({
                where: {id: orgId},
                include: [{model: Desk}]
            });

            if (organization) {
                return organization.desks;
            } else {
                throw new ApolloError('Организация не найдена', 'FIND_ERROR');
            }
        }

        const getOnlyPinDesks = async (): Promise<Desk[] | null> => {
            const organization: Organization | null = await Organization.findOne({
                where: {id: orgId},
                include: [{model: Desk, include: [{model: UserDesk, where: {user_id: payload?.userId}}]}]
            });

            if (organization) {
                return organization.desks;
            } else {
                throw new ApolloError('Организация не найдена', 'FIND_ERROR');
            }
        }

        const getOnlyTheirDesks = async (): Promise<Desk[] | null> => {
            const organization: Organization | null = await Organization.findOne({
                where: {id: orgId},
                include: [{model: Desk, include: [{model: UserDesk, where: {is_creator: true}}]}]
            });

            if (organization) {
                return organization.desks;
            } else {
                throw new ApolloError('Организация не найдена', 'FIND_ERROR');
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
            throw new ApolloError('Невозможно получить доступ', Errors.PERMISSIONS_ERROR);
        }

        const needRight: Right | null = await Right.findOne({where: {code: OrganizationRights.READ_DESK}});

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
                return getAllDesks();
            }

            const isOnpyPin: boolean = conditions.includes(BeginConditionTypes.ONLY_PIN);

            if (isOnpyPin) {
                return getOnlyPinDesks();
            }

            // TODO Продумать логику получения досок с критерием "Только свои+"
            const isOnlyTheir: boolean = conditions.includes(BeginConditionTypes.ONLY_THEIR);

            if (isOnlyTheir) {
                return getOnlyTheirDesks();
            }

            return null;
        }

        return null;
    }

    async getDesk({deskId}: GetDeskInput): Promise<Desk | null> {
        const desk: Desk | null = await Desk.findOne({
            where: {id: deskId},
            include: [{model: Message, include: [{model: User}]}]
        });

        if (!desk) {
            throw new ApolloError('Что то пошло не так...', Errors.READ_ERROR);
        }

        return desk;
    }

    async create({payload}: MyContext, {name, orgId}: CreateDeskInput): Promise<CreateDeskResponse> {
        if (payload?.userId) {
            const desk: Desk = await Desk.create({name, organization_id: orgId});
            const userDesk: UserDesk = await UserDesk.create({user_id: payload.userId, desk_id: desk.id});

            const role: Role | null = await Role.findOne({
                where: {
                    rating: 0,
                    organization_id: orgId,
                    purpose_id: PurposeTypes.desk
                }
            });

            if (!role) {
                throw new ApolloError('Что то пошло не так...', Errors.READ_ERROR)
            }

            await UserDeskRole.create({user_desk_id: userDesk.id, role_id: role.id});

            return {
                message: 'Доска успешно создана'
            }
        }

        throw new ApolloError('Пользователь не найден', 'ACCOUNT_ERROR');
    }

    async delete({deskId}: DeleteDeskInput): Promise<DeleteDeskResponse> {
        try {
            await Desk.destroy({where: {id: deskId}});
            return {message: 'Доска успешно удалена'};
        } catch (e) {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }
    }

    async update({deskId, name}: UpdateDeskInput): Promise<Desk> {
        try {
            const desk: Desk | null = await Desk.findOne({where: {id: deskId}});

            if (!desk) {
                throw new ApolloError('Такой доски больше не существует', 'READ_ERROR');
            }

            await desk.update({name});

            return desk;
        } catch (e) {
            throw new ApolloError('Что то пошло не так...', 'SOMETHING_ERROR');
        }
    }

    async getDeskEmployees({payload}: MyContext, {deskId}: GetDeskEmployeesInput): Promise<UserDesk[]> {
        const getLowerRoles = async (): Promise<UserDesk[]> => {
            const findMaxRating = (data: UserDesk): number => {
                return data.roles.reduce((acc: number, role: Role) => {
                    if (acc > role.rating) {
                        return role.rating;
                    } else {
                        return acc;
                    }
                }, -1)
            }

            let userDesks: UserDesk[] | null = await UserDesk.findAll({
                where: {desk_id: deskId},
                include: [
                    {model: UserDeskRole, include: [{model: Role}]},
                    {model: User, include: [{model: UserOrganization}]}
                ]
            });

            if (!userDesk) return [];

            userDesks.filter((a: UserDesk) => findMaxRating(a) > findMaxRating(userDesk));

            return userDesks;
        }

        const getAllRoles = async (): Promise<UserDesk[]> => {
            const userDesks: UserDesk[] | null = await UserDesk.findAll({
                where: {desk_id: deskId},
                include: [
                    {model: UserDeskRole, include: [{model: Role}]},
                    {model: User, include: [{model: UserOrganization}]}
                ]
            });
            return userDesks;
        }

        const userDesk: UserDesk | null = await UserDesk.findOne({
            where: {
                user_id: payload?.userId,
                desk_id: deskId
            },
            include: [{model: Role, include: [{model: RoleRight, include: [{model: BeginCondition}]}]}, {model: User}]
        })
        const needRight: Right | null = await Right.findOne({where: {code: DesksRights.READ_DESK_EMPLOYEES}});

        if (!needRight) {
            throw new ApolloError('Такого права не существует', Errors.READ_ERROR);
        }

        if (!userDesk) {
            throw new ApolloError('Нет прав для доступа к данной доске', Errors.PERMISSIONS_ERROR);
        }

        const conditions: BeginConditionTypes[] | null = userDesk.roles.reduce((acc: BeginConditionTypes[], role) => {
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

            return [];
        }

        return [];
    }

    async changeRoles({payload}: MyContext, {
        employeeId,
        roles,
        deskId,
    }: ChangeEmployeeRolesInput): Promise<ChangeEmployeeRolesResponse> {
        const updateRoles = async () => {
            const employee: UserOrganization | null = await UserOrganization.findOne({where: {id: employeeId}});

            if (!employee) {
                throw new ApolloError('Такого сотрудника не существует', Errors.READ_ERROR);
            }

            const userDesk: UserDesk | null = await UserDesk.findOne({
                where: {user_id: employeeId, desk_id: deskId},
                include: [{model: Role}]
            });

            if (!userDesk) {
                throw new ApolloError('Такого сотрудника не существует', Errors.READ_ERROR);
            }

            let haveRoles: Role[] = [...userDesk.roles];

            for (let i = 0; i < roles.length; i++) {
                const findRole: number = haveRoles.findIndex(role => role.id === roles[i]);

                if (findRole === -1) {
                    try {
                        await UserDeskRole.create({user_desk_id: userDesk.id, role_id: roles[i]})
                    } catch {
                        throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
                    }
                } else {
                    haveRoles = [...haveRoles.slice(0, findRole), ...haveRoles.slice(findRole + 1, haveRoles.length)]
                }
            }

            if (haveRoles.length) {
                for (let i = 0; i < haveRoles.length; i++) {
                    const userDeskRole: UserDeskRole | null = await UserDeskRole.findOne({
                        where: {
                            user_desk_id: userDesk.id,
                            role: haveRoles[i].id
                        }
                    });

                    if (!userDeskRole) {
                        throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
                    }

                    try {
                        await userDeskRole.destroy();
                    } catch {
                        throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
                    }
                }
            }
        }

        const findMaxRating = (userDesk: UserDesk): number => {
            return userDesk.roles.reduce((acc: number, role: Role) => {
                if (acc > role.rating) {
                    return role.rating;
                } else {
                    return acc;
                }
            }, -1);
        }

        const userDesk: UserDesk | null = await UserDesk.findOne({
            where: {
                user_id: payload?.userId,
                desk_id: deskId
            },
            include: [{model: Role, include: [{model: RoleRight, include: [{model: BeginCondition}]}]}, {model: User}]
        })
        const needRight: Right | null = await Right.findOne({where: {code: DesksRights.READ_DESK_EMPLOYEES}});

        if (!needRight) {
            throw new ApolloError('Такого права не существует', Errors.READ_ERROR);
        }

        if (!userDesk) {
            throw new ApolloError('Нет прав для доступа к данной доске', Errors.PERMISSIONS_ERROR);
        }

        const conditions: BeginConditionTypes[] | null = userDesk.roles.reduce((acc: BeginConditionTypes[], role) => {
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
                await updateRoles();
                return {
                    message: 'Роли обновлены'
                }
            }

            const isGetLowerRoles: boolean = conditions.includes(BeginConditionTypes.ONLY_LOWER_STATUS);

            if (isGetLowerRoles) {
                const employee: UserOrganization | null = await UserOrganization.findOne({where: {id: employeeId}});

                if (!employee) {
                    throw new ApolloError('Такого сотрудника не существует', Errors.READ_ERROR);
                }

                const employeeDesk: UserDesk | null = await UserDesk.findOne({
                    where: {user_id: employeeId, desk_id: deskId},
                    include: [{model: Role}]
                });

                if (!employeeDesk) {
                    throw new ApolloError('Такого сотрудника не существует', Errors.READ_ERROR);
                }

                if (findMaxRating(userDesk) < findMaxRating(employeeDesk)) {
                    await updateRoles();
                    return {
                        message: 'Роли обновлены'
                    };
                }
            }

            return {
                message: 'Роли обновлены'
            };
        }

        return {
            message: 'Роли обновлены'
        };
    }

    // TODO Затестить
    async invite({cache}: MyContext, {deskId, userId}: InviteDeskInput): Promise<InviteDeskResponse> {
        const user: User | null = await User.findOne({where: {id: userId}});

        if (!user) {
            throw new ApolloError('Такого пользователя больше не существует', 'READ_ERROR');
        }

        const token: string = v4();
        cache.set(INVITE_USER_DESK_PREFIX + token, {userId, deskId}, 1000 * 60 * 60 * 24 * 2);

        await MailService.sendMail({
            to: user.email,
            html: `<a href='http://localhost:3000/user/invite-desk/${token}'>Вас приглашают на </a>`,
            subject: 'Приглашение на доску'
        });

        return {
            message: `Письмо приглашения отправлено на почту ${user.email}`,
        };
    }

    // TODO Затестить
    async addUser({cache}: MyContext, {token}: AddUserDeskInput): Promise<AddUserDeskResponse> {
        const value: { userId: number, deskId: number } | undefined = cache.get(token);

        if (!value) {
            throw new ApolloError('Срок действия ссылки истёк', 'TIME_ERROR');
        }

        const desk: Desk | null = await Desk.findOne({
            where: {id: value.deskId},
            include: [{all: true, include: [{model: Role}]}]
        });

        if (!desk) {
            throw new ApolloError('Такой доски больше не существует', Errors.TOKEN_ERROR);
        }

        const user: User | undefined = await desk.organization.users.find(user => user.id === value.userId);

        if (!user) {
            throw new ApolloError('У вас нет доступа к данной доске', Errors.PERMISSIONS_ERROR);
        }

        const userDesk: UserDesk = await UserDesk.create({user_id: value.userId, desk_id: value.deskId});

        // TODO вынести в отдельные сервис создание дефолт ролей
        const role: Role | null = await Role.findOne({
            where: {
                organization_id: desk.organization_id,
                purpose_id: PurposeTypes.desk,
                name: DefaultRoles.EXECUTOR
            }
        })

        if (!role) {
            throw new ApolloError('Такой роли больше не существует', Errors.READ_ERROR);
        }

        await UserDeskRole.create({user_desk_id: userDesk.id, role_id: role.id});

        return {
            message: `Вы присоединилсь к доске ${desk.name}`
        }
    }
}

export default new DeskService();