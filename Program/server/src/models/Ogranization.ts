// Core
import {Column, Table, Model, DataType, HasMany, BelongsToMany} from 'sequelize-typescript';
import {Field, ID, ObjectType} from "type-graphql";

// Models
import {Desk} from './Desk';
import {Label} from "./Label";
import {UserOrganization} from "./UserOrganization";
import {User} from "./User";

interface OrganizationCreationAttrs {
    name: string;
    link_to_invite?: string;
}

@ObjectType()
@Table({tableName: 'organizations', timestamps: false})
export class Organization extends Model<Organization, OrganizationCreationAttrs> {
    @Field(() => ID)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false})
    name!: string;

    @Field(() => String, {nullable: true})
    @Column({type: DataType.TEXT, unique: true})
    link_to_invite?: string;

    @HasMany(() => Desk)
    desks: Desk[];

    @Field(() => [Label], {nullable: true})
    @HasMany(() => Label)
    labels: Label[];

    @BelongsToMany(() => User, () => UserOrganization)
    users: Array<User & { UserOrganization: UserOrganization }>;
}
