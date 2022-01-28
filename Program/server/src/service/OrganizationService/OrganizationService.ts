// Args
import {ApolloError} from "apollo-server-express";

// Types
import {DefaultRoles, Errors, MyContext} from "../../types";

// Args
import {CreateOrganizationInput, CreateOrganizationResponse} from "./args";

// Models
import {User} from "../../models/User";
import {Organization} from "../../models/Ogranization";
import {UserOrganization} from "../../models/UserOrganization";
import {Role} from "../../models/Role";
import {UserOrganizationRole} from "../../models/UserOrganizationRole";

// Service
import RolesService from "../RolesService/RolesService";

class OrganizationService {
    async getUserOrganizations({payload}: MyContext): Promise<Organization[]> {
        const user: User | null = await User.findOne({where: {id: payload?.userId}, include: [{model: Organization}]});

        if (!user) {
            throw new ApolloError('Пользователь не найден', Errors.PERMISSIONS_ERROR);
        }

        return user.organizations;
    }

    async create(data: CreateOrganizationInput, {payload}: MyContext): Promise<CreateOrganizationResponse> {
        if (payload?.userId) {
            const organization: Organization = await Organization.create(data);
            const userOrganization: UserOrganization = await UserOrganization.create({
                user_id: payload.userId,
                organization_id: organization.id
            })

            const role: Role = await RolesService.createDefaultRole({role: DefaultRoles.ORGANIZATION_OWNER, orgId: organization.id});
            await UserOrganizationRole.create({user_organization_id: userOrganization.id, role_id: role.id});

            return {
                message: 'Организация успешно создана'
            }
        };

        throw new ApolloError('Что то пошло не так...', Errors.SOMETHING_ERROR);
    }
}

export default new OrganizationService();