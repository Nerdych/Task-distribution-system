// Core
import {Column, Table, Model, DataType, ForeignKey, BelongsTo, BelongsToMany, HasMany} from 'sequelize-typescript';
import {Field, ID, Int, ObjectType} from "type-graphql";

// Models
import {Organization} from './Ogranization';
import {Right} from "./Right";
import {UserOrganizationRole} from "./UserOrganizationRole";
import {Purpose} from "./Purpose";
import {RoleRight} from "./RoleRight";
import {UserOrganization} from "./UserOrganization";
import {UserDesk} from "./UserDesk";
import {UserDeskRole} from "./UserDeskRole";

// Types
import {PurposeTypes} from "../types";

interface RoleCreationAttrs {
    name: string;
    rating: number;
    organization_id: number;
    purpose_id: PurposeTypes;
}

@ObjectType()
@Table({tableName: 'roles', timestamps: false})
export class Role extends Model<Role, RoleCreationAttrs> {
    @Field(() => ID)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false, unique: 'name_organization_id_purpose_id_unique'})
    name!: string;

    @Field(() => Int)
    @Column({type: DataType.INTEGER, allowNull: false})
    rating!: number;

    @Field(() => Int)
    @ForeignKey(() => Organization)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'name_organization_id_purpose_id_unique'})
    organization_id!: number;

    @Field(() => Int)
    @ForeignKey(() => Purpose)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'name_organization_id_purpose_id_unique'})
    purpose_id!: PurposeTypes;

    @Field(() => Organization)
    @BelongsTo(() => Organization)
    organization: Organization;

    @Field(() => Purpose)
    @BelongsTo(() => Purpose)
    purpose: Purpose;

    @Field(() => [RoleRight], {nullable: true})
    @HasMany(() => RoleRight)
    role_rights: RoleRight[];

    @Field(() => [Right], {nullable: true})
    @BelongsToMany(() => Right, () => RoleRight)
    rights: Array<Right & { RoleRight: RoleRight }>;

    @Field(() => [UserOrganization], {nullable: true})
    @BelongsToMany(() => UserOrganization, () => UserOrganizationRole)
    user_organization: Array<UserOrganization & { UserOrganizationRole: UserOrganizationRole }>;

    @Field(() => [UserDesk], {nullable: true})
    @BelongsToMany(() => UserDesk, () => UserDeskRole)
    user_desk: Array<UserDesk & { UserDeskRole: UserDeskRole }>;
}
