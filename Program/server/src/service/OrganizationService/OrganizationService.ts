// Args
import {ApolloError} from "apollo-server-express";

// Types
import {DefaultRoles, Errors, MyContext} from "../../types";

// Args
import {
    CreateOrganizationInput,
    CreateOrganizationResponse, GetOrganizationInput, GetOrganizationResponse,
    UpdateOrganizationInput,
    UpdateOrganizationResponse
} from "./args";
import {RoleRight} from "../RightService/args";

// Models
import {User} from "../../models/User";
import {Organization} from "../../models/Ogranization";
import {UserOrganization} from "../../models/UserOrganization";
import {Role} from "../../models/Role";
import {UserOrganizationRole} from "../../models/UserOrganizationRole";
import {Desk} from "../../models/Desk";

// Service
import RolesService from "../RolesService/RolesService";
import DeskService from "../DeskService/DeskService";
import RightService from "../RightService/RightService";

class OrganizationService {
    async getUserOrganizations({payload}: MyContext): Promise<Organization[]> {
        const user: User | null = await User.findOne({where: {id: payload?.userId}, include: [{model: Organization}]});

        if (!user) {
            throw new ApolloError('Пользователь не найден', Errors.PERMISSIONS_ERROR);
        }

        return user.organizations;
    }

    // TODO Затестить
    async getOrganization(ctx: MyContext, {orgId}: GetOrganizationInput): Promise<GetOrganizationResponse> {
        const organization: Organization | null = await Organization.findOne({
            where: {id: orgId},
            include: {all: true}
        });

        if (!organization || !ctx.payload?.userId) {
            throw new ApolloError('Такой организации не существует', Errors.READ_ERROR);
        }

        const desks: Desk[] | null = await DeskService.getDesks(ctx, {orgId});
        const rights: RoleRight[] | null = await RightService.getUserOrganizationRights({orgId, userId: ctx.payload.userId});

        return {
            name: organization.name,
            desks,
            rights
        };
    }

    async create({payload}: MyContext, data: CreateOrganizationInput,): Promise<CreateOrganizationResponse> {
        if (payload?.userId) {
            const organization: Organization = await Organization.create(data);
            const userOrganization: UserOrganization = await UserOrganization.create({
                user_id: payload.userId,
                organization_id: organization.id
            })

            const role: Role = await RolesService.createDefaultRole({
                role: DefaultRoles.ORGANIZATION_OWNER,
                orgId: organization.id
            });
            await UserOrganizationRole.create({user_organization_id: userOrganization.id, role_id: role.id});

            return {
                message: 'Организация успешно создана'
            }
        }
        ;

        throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
    }

    // TODO Затестить
    async update({payload}: MyContext, {
        orgId,
        name,
        linkToInvite
    }: UpdateOrganizationInput): Promise<UpdateOrganizationResponse> {
        const organization: Organization | null = await Organization.findOne({where: {id: orgId}});

        if (!organization) {
            throw new ApolloError('Такой организации не существует', Errors.READ_ERROR);
        }

        linkToInvite = `https://localhost:5000/invite/${linkToInvite}`;

        try {
            await organization.update({name, link_to_invite: linkToInvite});
            return {
                message: 'Организация успешно обновлена'
            }
        } catch {
            throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
        }
    }
}

export default new OrganizationService();