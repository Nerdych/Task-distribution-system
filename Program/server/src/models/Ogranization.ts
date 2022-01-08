// Core
import {Column, Table, Model, DataType, HasMany, BelongsToMany} from 'sequelize-typescript';

// Models
import {Desk} from './Desk';
import {Label} from "./Label";
import {UserOrganization} from "./UserOrganization";
import {User} from "./User";

interface OrganizationCreationAttrs {
    name: string;
    link_to_invite?: string;
}

@Table({tableName: 'organizations', timestamps: false})
export class Organization extends Model<Organization, OrganizationCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Column({type: DataType.TEXT, allowNull: false})
    name!: string;

    @Column({type: DataType.TEXT, unique: true})
    link_to_invite: string;

    @HasMany(() => Desk)
    desks: Desk[];

    @HasMany(() => Label)
    labels: Label[];

    @BelongsToMany(() => User, () => UserOrganization)
    users: Array<User & { UserOrganization: UserOrganization }>;
}
