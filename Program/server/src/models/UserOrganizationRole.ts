// Core
import {Column, Table, Model, ForeignKey, DataType, BelongsTo} from 'sequelize-typescript';

// Models
import {Role} from "./Role";
import {UserOrganization} from "./UserOrganization";
import {Field, ObjectType} from "type-graphql";

interface UserOrganizationRoleCreationAttrs {
    user_organization_id: number;
    role_id: number;
}

@ObjectType()
@Table({tableName: 'user_organization_role', timestamps: false})
export class UserOrganizationRole extends Model<UserOrganizationRole, UserOrganizationRoleCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @ForeignKey(() => UserOrganization)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'user_organization_id_role_id_unique'})
    user_organization_id: number;

    @ForeignKey(() => Role)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'user_organization_id_role_id_unique'})
    role_id: number;

    @Field(() => Role)
    @BelongsTo(() => Role)
    role: Role
}
