// Core
import {Column, Table, Model, DataType, ForeignKey, BelongsTo} from 'sequelize-typescript';

// Models
import {List} from './List';

interface TaskCreationAttrs {
    title: string;
    is_checked: boolean;
}

@Table({tableName: 'tasks', timestamps: false})
export class Task extends Model<Task, TaskCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Column({type: DataType.TEXT, allowNull: false})
    title!: string;

    @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
    is_checked!: boolean;

    @ForeignKey(() => List)
    @Column({type: DataType.INTEGER, allowNull: false})
    list_id!: number;

    @BelongsTo(() => List)
    list: List;
}
