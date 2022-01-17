// Core
import {Column, Table, Model, DataType, BelongsToMany} from 'sequelize-typescript';
import {Field, ID, ObjectType} from "type-graphql";

// Models
import {DeskRole} from "./DeskRole";
import {DeskRoleDeskRight} from "./DeskRoleDeskRight";

interface DeskRightCreationAttrs {
    name: string;
}

@ObjectType()
@Table({tableName: 'desks_rights', timestamps: false})
export class DeskRight extends Model<DeskRight, DeskRightCreationAttrs> {
    @Field(() => ID)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false, unique: true})
    name!: string;

    @Field(() => DeskRole, {nullable: true})
    @BelongsToMany(() => DeskRole, () => DeskRoleDeskRight)
    desks_roles: Array<DeskRole & { DeskRoleDeskRight: DeskRoleDeskRight }>;
}
