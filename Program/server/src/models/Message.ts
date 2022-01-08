// Core
import {Column, Table, Model, ForeignKey, DataType} from 'sequelize-typescript';

// Models
import {User} from "./User";
import {Desk} from "./Desk";

interface MessageCreationAttrs {
    text: string;
    date_of_create: Date;
    desk_id: number;
    user_id: number;
}

@Table({tableName: 'messages', timestamps: false})
export class Message extends Model<Message, MessageCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Column({type: DataType.TEXT, allowNull: false})
    text!: string;

    @Column({type: DataType.DATE, allowNull: false})
    date_of_create!: Date;

    @ForeignKey(() => Desk)
    @Column({type: DataType.INTEGER, allowNull: false})
    desk_id: number

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    user_id: number
}
