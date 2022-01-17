// Core
import {Column, Table, Model, ForeignKey, DataType} from 'sequelize-typescript';

// Models
import {OrganizationRole} from "./OrganizationRole";
import {OrganizationRight} from "./OrganizationRight";

interface OrganizationRoleOrganizationRightCreationAttrs {
    organization_role_id: number;
    organization_right_id: number;
}

@Table({tableName: 'organization_role_organization_right', timestamps: false})
export class OrganizationRoleOrganizationRight extends Model<OrganizationRoleOrganizationRight, OrganizationRoleOrganizationRightCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @ForeignKey(() => OrganizationRole)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'organization_role_id_organization_right_id_unique'})
    organization_role_id: number

    @ForeignKey(() => OrganizationRight)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'organization_role_id_organization_right_id_unique'})
    organization_right_id: number
}
