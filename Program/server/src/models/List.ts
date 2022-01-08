// Core
import {Column, Table, Model, DataType, ForeignKey, BelongsTo, HasMany} from 'sequelize-typescript';

// Models
import {Card} from './Card';
import {Task} from './Task';

interface ListCreationAttrs {
    name: string;
    card_id: number;
}

@Table({tableName: 'lists', timestamps: false})
export class List extends Model<List, ListCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Column({type: DataType.TEXT, allowNull: false})
    name!: string;

    @ForeignKey(() => Card)
    @Column({type: DataType.INTEGER, allowNull: false})
    card_id!: number;

    @BelongsTo(() => Card)
    card: Card;

    @HasMany(() => Task)
    tasks: Task[];
}
