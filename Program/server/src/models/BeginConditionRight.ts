// Core
import {Column, Table, Model, ForeignKey, DataType} from 'sequelize-typescript';

// Models
import {BeginCondition} from "./BeginCondition";
import {Right} from "./Right";

interface BeginConditionRightCreationAttrs {
    right_id: number;
    begin_condition_id: number;
}

@Table({tableName: 'begin_condition_right', timestamps: false})
export class BeginConditionRight extends Model<BeginConditionRight, BeginConditionRightCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @ForeignKey(() => Right)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'pk_begin_condition_right_id'})
    right_id: number

    @ForeignKey(() => BeginCondition)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'pk_begin_condition_right_id'})
    begin_condition_id: number
}
