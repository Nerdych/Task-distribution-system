// Core
import {Column, Table, Model, ForeignKey, DataType} from 'sequelize-typescript';

// Models
import {User} from "./User";
import {DeskRole} from "./DeskRole";

interface UserDeskRoleCreationAttrs {
    user_id: number;
    desk_role_id: number;
}

@Table({tableName: 'user_desk_role', timestamps: false})
export class UserDeskRole extends Model<UserDeskRole, UserDeskRoleCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'user_id_desk_role_id_unique'})
    user_id: number

    @ForeignKey(() => DeskRole)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'user_id_desk_role_id_unique'})
    desk_role_id: number
}
