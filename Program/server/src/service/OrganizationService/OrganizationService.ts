// Args
import {ApolloError} from "apollo-server-express";

// Types
import {MyContext, PurposeTypes} from "../../types";

// Models
import {User} from "../../models/User";
import {Organization} from "../../models/Ogranization";

// Args
import {CreateOrganizationInput, CreateOrganizationResponse} from "./args";
import {UserOrganization} from "../../models/UserOrganization";
import {Role} from "../../models/Role";
import {UserOrganizationRole} from "../../models/UserOrganizationRole";
import {RoleRight} from "../../models/RoleRight";
import {Right} from "../../models/Right";

class OrganizationService {
    async getUserOrganizations({payload}: MyContext): Promise<Organization[]> {
        const user: User | null = await User.findOne({where: {id: payload?.userId}, include: [{model: Organization}]});

        if (!user) {
            throw new ApolloError('Пользователь не найден', 'ACCOUNT_ERROR');
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
            const role: Role = await Role.create({
                name: 'Владелец организации',
                organization_id: organization.id,
                purpose_id: PurposeTypes.organization
            });
            const rights: Right[] = await Right.findAll({where: {purpose_id: PurposeTypes.organization}});
            await rights.forEach(async right => {
                await RoleRight.create({right_id: right.id, role_id: role.id});
            });
            await UserOrganizationRole.create({user_organization_id: userOrganization.id, role_id: role.id});

            return {
                message: 'Организация успешно создана'
            }
        }
        ;

        throw new ApolloError('Что то пошло не так...', 'SOMETHING_ERROR');
    }
}

export default new OrganizationService();