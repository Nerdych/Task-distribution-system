// Core
import {Column, Table, Model, ForeignKey, DataType} from 'sequelize-typescript';

// Models
import {User} from "./User";
import {OrganizationRole} from "./OrganizationRole";

interface UserOrganizationRoleCreationAttrs {
    user_id: number;
    organization_role_id: number;
}

@Table({tableName: 'user_organization_role', timestamps: false})
export class UserOrganizationRole extends Model<UserOrganizationRole, UserOrganizationRoleCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'user_id_organization_role_id_unique'})
    user_id: number

    @ForeignKey(() => OrganizationRole)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'user_id_organization_role_id_unique'})
    organization_role_id: number
}
