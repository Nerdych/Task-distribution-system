// Core
import {Column, Table, Model, DataType, ForeignKey, BelongsTo, HasMany} from 'sequelize-typescript';
import {Field, ID, Int, ObjectType} from "type-graphql";

// Models
import {Card} from './Card';
import {Desk} from './Desk';

interface ColumnTableCreationAttrs {
    name: string;
    desk_id: number;
}

@ObjectType()
@Table({tableName: 'columns', timestamps: false})
export class ColumnTable extends Model<ColumnTable, ColumnTableCreationAttrs> {
    @Field(() => ID)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false})
    name!: string;

    @Field(() => Int)
    @ForeignKey(() => Desk)
    @Column({type: DataType.INTEGER, allowNull: false})
    desk_id!: number;

    @Field(() => Desk)
    @BelongsTo(() => Desk)
    desk: Desk;

    @Field(() => [Card], {nullable: true})
    @HasMany(() => Card)
    cards: Card[];
}
