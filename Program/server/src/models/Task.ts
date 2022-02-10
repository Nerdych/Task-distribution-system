// Core
import {Column, Table, Model, DataType, ForeignKey, BelongsTo} from 'sequelize-typescript';
import {Field, ID, Int, ObjectType} from "type-graphql";

// Models
import {List} from './List';

interface TaskCreationAttrs {
    title: string;
    list_id: number;
    is_checked?: boolean;
}

@ObjectType()
@Table({tableName: 'tasks', timestamps: false})
export class Task extends Model<Task, TaskCreationAttrs> {
    @Field(() => ID)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false})
    title!: string;

    @Field(() => Boolean)
    @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
    is_checked!: boolean;

    @Field(() => Int)
    @ForeignKey(() => List)
    @Column({type: DataType.INTEGER, allowNull: false})
    list_id!: number;

    @Field(() => List)
    @BelongsTo(() => List)
    list: List;
}
