// Core
import {Column, Table, Model, DataType} from 'sequelize-typescript';
import {Field, ID, ObjectType} from "type-graphql";

// Types
import {BeginCondition as BeginConditionTypes} from "../types";

interface BeginConditionCreationAttrs {
    name: string;
    code: string;
}

@ObjectType()
@Table({tableName: 'begin_conditions', timestamps: false})
export class BeginCondition extends Model<BeginCondition, BeginConditionCreationAttrs> {
    @Field(() => ID)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false, unique: true})
    name!: string;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false, unique: true})
    code!: BeginConditionTypes;
}
