// Core
import {Column, Table, Model, DataType, ForeignKey, BelongsTo, HasMany} from 'sequelize-typescript';
import {Card} from './Card';

// Models
import {Desk} from './Desk';

interface ColumnTableCreationAttrs {
    name: string;
    desk_id: number;
}

@Table({tableName: 'columns', timestamps: false})
export class ColumnTable extends Model<ColumnTable, ColumnTableCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Column({type: DataType.TEXT, allowNull: false})
    name!: string;

    @ForeignKey(() => Desk)
    @Column({type: DataType.INTEGER, allowNull: false})
    desk_id!: number;

    @BelongsTo(() => Desk)
    desk: Desk;

    @HasMany(() => Card)
    cards: Card[];
}
