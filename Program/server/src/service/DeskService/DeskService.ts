// Args
import {ApolloError} from "apollo-server-express";
import {v4} from "uuid";

// Types
import {
    BeginCondition as BeginConditionTypes,
    DefaultRoles,
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

// Args
import {
    AddUserDeskInput,
    AddUserDeskResponse,
    CreateDeskInput,
    CreateDeskResponse,
    DeleteDeskInput,
    DeleteDeskResponse,
    GetDeskInput,
    GetDesksInput,
    InviteDeskInput,
    InviteDeskResponse,
    UpdateDeskInput
} from "./args";

// Service
import RolesService from "../RolesService/RolesService";

// Models
import {UserOrganization} from "../../models/UserOrganization";
import {Right} from "../../models/Right";
import {RoleRight} from "../../models/RoleRight";


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
            }, include: {model: Role, include: [{all: true}]}
        })

        if (!userOrganization) {
            throw new ApolloError('Нет прав для доступа к данной организации', Errors.PERMISSIONS_ERROR);
        }

        const needRight: Right | null = await Right.findOne({where: {code: OrganizationRights.READ_DESK}});

        if (!needRight) {
            throw new ApolloError('Такого права не существует', Errors.READ_ERROR);
        }

        // TODO затестить
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

    // TODO Затестить
    async getDesk({deskId}: GetDeskInput): Promise<Desk | null> {
        const desk: Desk | null = await Desk.findOne({where: {id: deskId}});

        if (!desk) {
            throw new ApolloError('Что то пошло не так...', Errors.READ_ERROR);
        }

        return desk;
    }

    // TODO Затестить
    async create({payload}: MyContext, {name, orgId}: CreateDeskInput): Promise<CreateDeskResponse> {
        if (payload?.userId) {
            const desk: Desk = await Desk.create({name, organization_id: orgId});
            const userDesk: UserDesk = await UserDesk.create({user_id: payload.userId, desk_id: desk.id});

            const role: Role = await RolesService.createDefaultRole({role: DefaultRoles.DESK_OWNER, orgId});
            await UserDeskRole.create({user_desk_id: userDesk.id, role_id: role.id});

            return {
                message: 'Карточка успешно создана'
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