// Core
import {Column, Table, Model, ForeignKey, DataType, HasMany} from 'sequelize-typescript';

// Models
import {User} from "./User";
import {Organization} from "./Ogranization";
import {UserOrganizationRole} from "./UserOrganizationRole";
import {Field} from "type-graphql";

interface UserOrganizationCreationAttrs {
    experience: number;
    hourly_rate: number;
    is_vacation: number;
    user_id: number;
    organization_id: number;
}

@Table({tableName: 'user_organization', timestamps: false})
export class UserOrganization extends Model<UserOrganization, UserOrganizationCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Column({type: DataType.INTEGER, allowNull: false})
    experience!: number;

    @Column({type: DataType.INTEGER, allowNull: false})
    hourly_rate!: number;

    @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
    is_vacation!: boolean;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'user_id_organization_id_unique'})
    user_id: number

    @ForeignKey(() => Organization)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'user_id_organization_id_unique'})
    organization_id: number

    @HasMany(() => UserOrganizationRole)
    user_organization_role: UserOrganizationRole[];
}
