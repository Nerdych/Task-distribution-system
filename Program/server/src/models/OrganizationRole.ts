// Core
import {Column, Table, Model, DataType, ForeignKey, BelongsTo, HasMany, BelongsToMany} from 'sequelize-typescript';
import {Field, ID, Int, ObjectType} from "type-graphql";

// Models
import {Organization} from './Ogranization';
import {OrganizationRight} from "./OrganizationRight";
import {OrganizationRoleOrganizationRight} from "./OrganizationRoleOrganizationRight";
import {UserOrganizationRole} from "./UserOrganizationRole";
import {User} from "./User";

interface OrganizationRoleCreationAttrs {
    name: string;
    organization_id: number;
}

@ObjectType()
@Table({tableName: 'organizations_roles', timestamps: false})
export class OrganizationRole extends Model<OrganizationRole, OrganizationRoleCreationAttrs> {
    @Field(() => ID)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false, unique: 'name_organization_id_unique'})
    name!: string;

    @Field(() => Int)
    @ForeignKey(() => Organization)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'name_organization_id_unique'})
    organization_id!: number;

    @Field(() => Organization)
    @BelongsTo(() => Organization)
    organization: Organization;

    @Field(() => [OrganizationRight], {nullable: true})
    @BelongsToMany(() => OrganizationRight, () => OrganizationRoleOrganizationRight)
    organizations_rights: Array<OrganizationRight & {OrganizationRoleOrganizationRight: OrganizationRoleOrganizationRight}>;

    @Field(() => [User], {nullable: true})
    @BelongsToMany(() => User, () => UserOrganizationRole)
    users: Array<User & { UserOrganizationRole: UserOrganizationRole }>;
}
