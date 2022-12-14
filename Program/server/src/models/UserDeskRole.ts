// Core
import {Column, Table, Model, ForeignKey, DataType, HasMany, BelongsTo} from 'sequelize-typescript';

// Models
import {UserDesk} from "./UserDesk";
import {Role} from "./Role";
import {Field, ObjectType} from "type-graphql";
import {Right} from "./Right";

interface UserDeskRoleCreationAttrs {
    user_desk_id: number;
    role_id: number;
}

@ObjectType()
@Table({tableName: 'user_desk_role', timestamps: false})
export class UserDeskRole extends Model<UserDeskRole, UserDeskRoleCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @ForeignKey(() => UserDesk)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'user_desk_id_role_id_unique'})
    user_desk_id: number

    @ForeignKey(() => Role)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'user_desk_id_role_id_unique'})
    role_id: number

    @Field(() => Role)
    @BelongsTo(() => Role)
    role: Role
}
