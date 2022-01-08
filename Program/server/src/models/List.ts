// Core
import {Column, Table, Model, DataType, ForeignKey, BelongsTo, HasMany} from 'sequelize-typescript';
import {Field, ID, Int, ObjectType} from "type-graphql";

// Models
import {Card} from './Card';
import {Task} from './Task';

interface ListCreationAttrs {
    name: string;
    card_id: number;
}

@ObjectType()
@Table({tableName: 'lists', timestamps: false})
export class List extends Model<List, ListCreationAttrs> {
    @Field(() => ID)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false})
    name!: string;

    @Field(() => Int)
    @ForeignKey(() => Card)
    @Column({type: DataType.INTEGER, allowNull: false})
    card_id!: number;

    @BelongsTo(() => Card)
    card: Card;

    @HasMany(() => Task)
    tasks: Task[];
}
