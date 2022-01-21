// Args
import {ApolloError} from "apollo-server-express";

// Types
import {MyContext, PurposeTypes} from "../../types";

// Models
import {User} from "../../models/User";
import {Desk} from "../../models/Desk";
import {UserDesk} from "../../models/UserDesk";
import {Role} from "../../models/Role";
import {Right} from "../../models/Right";
import {RoleRight} from "../../models/RoleRight";
import {UserDeskRole} from "../../models/UserDeskRole";

// Args
import {CreateDeskInput, CreateDeskResponse, GetDeskInput} from "./args";

class DeskService {
    async getUserDesks({payload}: MyContext): Promise<Desk[] | null> {
        const user: User | null = await User.findOne({where: {id: payload?.userId}, include: [{model: Desk}]});

        if (!user) {
            throw new ApolloError('Пользователь не найден', 'ACCOUNT_ERROR');
        }

        return user.desks;
    }

    async create({payload}: MyContext, {name, orgId}: CreateDeskInput): Promise<CreateDeskResponse> {
        if (payload?.userId) {
            const desk: Desk = await Desk.create({name, organization_id: orgId});
            const userDesk: UserDesk = await UserDesk.create({user_id: payload?.userId, desk_id: desk.id});
            const role: Role = await Role.create({
                name: 'Создатель карточки',
                organization_id: orgId,
                purpose_id: PurposeTypes.desk
            });
            const rights: Right[] = await Right.findAll({where: {purpose_id: PurposeTypes.desk}});
            await rights.forEach(async right => {
                await RoleRight.create({right_id: right.id, role_id: role.id});
            });
            await UserDeskRole.create({user_desk_id: userDesk.id, role_id: role.id});

            return {
                message: 'Карточка успешно создана'
            }
        }

        throw new ApolloError('Пользователь не найден', 'ACCOUNT_ERROR');
    }

    async getById({payload}: MyContext, {id}: GetDeskInput): Promise<Desk | null> {
        const desk: Desk | null = await Desk.findOne({where: {id}});

        // TODO проверка на то что можно ли ваще взять то

        return desk;
    }
}

export default new DeskService();