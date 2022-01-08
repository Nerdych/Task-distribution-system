// Core
import {Column, Table, Model, ForeignKey, DataType} from 'sequelize-typescript';

// Models
import {User} from "./User";
import {Role} from "./Role";

interface UserRoleCreationAttrs {
    user_id: number;
    role_id: number;
}

@Table({tableName: 'user_role', timestamps: false})
export class UserRole extends Model<UserRole, UserRoleCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'user_id_role_id_unique'})
    user_id: number

    @ForeignKey(() => Role)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'user_id_role_id_unique'})
    role_id: number
}
