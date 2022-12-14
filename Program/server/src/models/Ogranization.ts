// Core
import {Column, Table, Model, DataType, HasMany, BelongsToMany, ForeignKey} from 'sequelize-typescript';
import {Field, ID, ObjectType} from "type-graphql";

// Models
import {Desk} from './Desk';
import {Label} from "./Label";
import {UserOrganization} from "./UserOrganization";
import {User} from "./User";
import {Role} from "./Role";
import {File} from "./File";

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

    @ForeignKey(() => File)
    @Column({type: DataType.INTEGER, unique: true})
    file_id?: number

    @Field(() => [Desk], {nullable: true})
    @HasMany(() => Desk)
    desks: Desk[];

    @Field(() => [Role], {nullable: true})
    @HasMany(() => Role)
    roles: Role[];

    @Field(() => [Label], {nullable: true})
    @HasMany(() => Label)
    labels: Label[];

    @Field(() => [User])
    @BelongsToMany(() => User, () => UserOrganization)
    users: Array<User>;
}
