// Core
import {Column, Table, Model, DataType, ForeignKey, BelongsTo} from 'sequelize-typescript';
import {Card} from './Card';

// Models
import {User} from "./User";

interface CommentCreationAttrs {
    text: string;
    date_of_create: Date;
    card_id: number;
    user_id: number;
}

@Table({tableName: 'comments', timestamps: false})
export class Comment extends Model<Comment, CommentCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Column({type: DataType.TEXT, allowNull: false})
    text!: string;

    @Column({type: DataType.DATE, allowNull: false})
    date_of_create!: Date;

    @ForeignKey(() => Card)
    @Column({type: DataType.INTEGER, allowNull: false})
    card_id!: number;

    @BelongsTo(() => Card)
    card: Card;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    user_id!: number;

    @BelongsTo(() => User)
    user: User;
}
