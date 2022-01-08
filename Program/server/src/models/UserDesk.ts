// Core
import {Column, Table, Model, ForeignKey, DataType} from 'sequelize-typescript';

// Models
import {User} from "./User";
import {Desk} from "./Desk";

interface UserDeskCreationAttrs {
    user_id: number;
    desk_id: number;
}

@Table({tableName: 'user_desk', timestamps: false})
export class UserDesk extends Model<UserDesk, UserDeskCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'user_id_desk_id_unique'})
    user_id: number

    @ForeignKey(() => Desk)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'user_id_desk_id_unique'})
    desk_id: number
}
