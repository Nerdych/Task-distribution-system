// Core
import {Column, Table, Model, DataType, ForeignKey, BelongsToMany, BelongsTo, HasMany} from 'sequelize-typescript';
import {Field, ID, ObjectType} from "type-graphql";

// Models
import {Role} from "./Role";
import {Purpose} from "./Purpose";
import {RoleRight} from "./RoleRight";
import {DesksRights, OrganizationRights} from "../types";
import {ObjectTable} from "./Object";
import {Action} from "./Action";

interface RightCreationAttrs {
    name: string;
    code: string;
    purpose_id: number;
}

@ObjectType()
@Table({tableName: 'rights', timestamps: false})
export class Right extends Model<Right, RightCreationAttrs> {
    @Field(() => ID)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false})
    name!: string;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false, unique: 'code_purpose_id_action_id_object_id_unique'})
    code!: OrganizationRights | DesksRights;

    @Field(() => String)
    @ForeignKey(() => Purpose)
    @Column({type: DataType.TEXT, allowNull: false, unique: 'code_purpose_id_action_id_object_id_unique'})
    purpose_id!: number;

    @Field(() => String)
    @ForeignKey(() => ObjectTable)
    @Column({type: DataType.TEXT, allowNull: false, unique: 'code_purpose_id_action_id_object_id_unique'})
    object_id!: number;

    @Field(() => String)
    @ForeignKey(() => Action)
    @Column({type: DataType.TEXT, allowNull: false, unique: 'code_purpose_id_action_id_object_id_unique'})
    action_id!: number;

    @Field(() => String, {nullable: true})
    @ForeignKey(() => Right)
    @Column({type: DataType.TEXT})
    parent_id: number;

    @Field(() => Purpose)
    @BelongsTo(() => Purpose)
    purpose: Purpose;

    @Field(() => ObjectTable)
    @BelongsTo(() => ObjectTable)
    object: ObjectTable;

    @Field(() => Action)
    @BelongsTo(() => Action)
    action: Action;

    @Field(() => Right, {nullable: true})
    @BelongsTo(() => Right)
    parent: Right;

    @Field(() => [RoleRight], {nullable: true})
    @HasMany(() => RoleRight)
    roleRights: RoleRight[];

    @Field(() => [Role], {nullable: true})
    @BelongsToMany(() => Role, () => RoleRight)
    roles: Array<Role & { RoleRight: RoleRight }>;
}
