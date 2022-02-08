// Core
import {Column, Table, Model, DataType, ForeignKey, BelongsTo} from 'sequelize-typescript';
import {Field, ID, Int, ObjectType} from "type-graphql";

// Models
import {Card} from './Card';
import {User} from "./User";

interface CommentCreationAttrs {
    text: string;
    date_of_create?: Date;
    card_id: number;
    user_id: number;
}

@ObjectType()
@Table({tableName: 'comments', timestamps: false})
export class Comment extends Model<Comment, CommentCreationAttrs> {
    @Field(() => ID)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false})
    text!: string;

    @Field(() => String)
    @Column({type: DataType.DATE, allowNull: false, defaultValue: new Date()})
    date_of_create!: Date;

    @Field(() => Int)
    @ForeignKey(() => Card)
    @Column({type: DataType.INTEGER, allowNull: false})
    card_id!: number;

    @Field(() => Int)
    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    user_id!: number;

    @Field(() => Card)
    @BelongsTo(() => Card)
    card: Card;

    @Field(() => User)
    @BelongsTo(() => User)
    user: User;
}
