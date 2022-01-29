// Core
import {Column, Table, Model, ForeignKey, DataType, HasMany, BelongsToMany} from 'sequelize-typescript';

// Models
import {User} from "./User";
import {Organization} from "./Ogranization";
import {UserOrganizationRole} from "./UserOrganizationRole";
import {Field, ObjectType} from "type-graphql";
import {Desk} from "./Desk";
import {UserDesk} from "./UserDesk";
import {Role} from "./Role";

interface UserOrganizationCreationAttrs {
    experience?: number;
    hourly_rate?: number;
    is_vacation?: number;
    is_creator?: boolean;
    user_id: number;
    organization_id: number;
}

@ObjectType()
@Table({tableName: 'user_organization', timestamps: false})
export class UserOrganization extends Model<UserOrganization, UserOrganizationCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
    experience!: number;

    @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
    hourly_rate!: number;

    @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
    is_vacation?: boolean;

    @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
    is_creator?: boolean;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'user_id_organization_id_unique'})
    user_id: number;

    @ForeignKey(() => Organization)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'user_id_organization_id_unique'})
    organization_id: number;

    @Field(() => [Role])
    @BelongsToMany(() => Role, () => UserOrganizationRole)
    roles: Array<Role>;
}
