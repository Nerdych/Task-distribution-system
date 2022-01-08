// Core
import {Column, Table, Model, DataType, ForeignKey, BelongsTo, HasMany, BelongsToMany} from 'sequelize-typescript';

// Models
import {ColumnTable} from './Column';
import {List} from './List';
import {User} from './User';
import {LabelCard} from "./LabelCard";
import {Label} from "./Label";

interface CardCreationAttrs {
    name: string;
    column_id: number;
    user_id: number;
    description?: string;
    deadline?: Date;
}

@Table({tableName: 'cards', timestamps: false})
export class Card extends Model<Card, CardCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Column({type: DataType.TEXT, allowNull: false})
    name!: string;

    @Column({type: DataType.TEXT})
    description: string;

    @Column({type: DataType.DATE})
    deadline: Date;

    @Column({type: DataType.DATEONLY, allowNull: false, defaultValue: new Date()})
    date_of_create: Date;

    @ForeignKey(() => ColumnTable)
    @Column({type: DataType.INTEGER, allowNull: false})
    column_id!: number;

    @BelongsTo(() => ColumnTable)
    column: ColumnTable;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    user_id!: number;

    @BelongsTo(() => User)
    user: User;

    @HasMany(() => List)
    lists: List[];

    @BelongsToMany(() => Label, () => LabelCard)
    cards: Array<Label & { LabelCard: LabelCard }>;
}
