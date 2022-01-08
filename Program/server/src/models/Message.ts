// Core
import {Column, Table, Model, ForeignKey, DataType} from 'sequelize-typescript';
import {Field, ID, Int, ObjectType} from "type-graphql";

// Models
import {User} from "./User";
import {Desk} from "./Desk";

interface MessageCreationAttrs {
    text: string;
    date_of_create: Date;
    desk_id: number;
    user_id: number;
}

@ObjectType()
@Table({tableName: 'messages', timestamps: false})
export class Message extends Model<Message, MessageCreationAttrs> {
    @Field(() => ID)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false})
    text!: string;

    @Field(() => String)
    @Column({type: DataType.DATE, allowNull: false})
    date_of_create!: Date;

    @Field(() => Int)
    @ForeignKey(() => Desk)
    @Column({type: DataType.INTEGER, allowNull: false})
    desk_id: number

    @Field(() => Int)
    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    user_id: number
}
