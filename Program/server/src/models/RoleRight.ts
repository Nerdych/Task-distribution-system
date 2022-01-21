// Core
import {Column, Table, Model, ForeignKey, DataType} from 'sequelize-typescript';

// Models
import {Role} from "./Role";
import {Right} from "./Right";
import {BeginCondition} from "./BeginCondition";

interface RoleRightCreationAttrs {
    role_id: number;
    right_id: number;
    begin_condition_id?: number;
}

@Table({tableName: 'role_right', timestamps: false})
export class RoleRight extends Model<RoleRight, RoleRightCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @ForeignKey(() => BeginCondition)
    @Column({type: DataType.INTEGER})
    begin_condition_id: number

    @ForeignKey(() => Role)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'role_id_right_id_unique'})
    role_id!: number

    @ForeignKey(() => Right)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'role_id_right_id_unique'})
    right_id!: number
}
