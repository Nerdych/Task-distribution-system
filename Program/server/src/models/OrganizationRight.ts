// Core
import {Column, Table, Model, DataType, ForeignKey, BelongsTo, BelongsToMany} from 'sequelize-typescript';
import {Field, ID, ObjectType} from "type-graphql";

// Models
import {OrganizationRole} from "./OrganizationRole";
import {OrganizationRoleOrganizationRight} from "./OrganizationRoleOrganizationRight";

interface OrganizationRightCreationAttrs {
    name: string;
}

@ObjectType()
@Table({tableName: 'organizations_rights', timestamps: false})
export class OrganizationRight extends Model<OrganizationRight, OrganizationRightCreationAttrs> {
    @Field(() => ID)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false, unique: true})
    name!: string;

    @Field(() => OrganizationRole, {nullable: true})
    @BelongsToMany(() => OrganizationRole, () => OrganizationRoleOrganizationRight)
    organizations_roles: Array<OrganizationRole & { OrganizationRoleOrganizationRight: OrganizationRoleOrganizationRight }>;
}
