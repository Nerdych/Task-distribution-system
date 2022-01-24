// Core
import {Column, Table, Model, ForeignKey, DataType, HasMany, BelongsToMany} from 'sequelize-typescript';

// Models
import {User} from "./User";
import {Desk} from "./Desk";
import {UserDeskRole} from "./UserDeskRole";
import {Field, ObjectType} from "type-graphql";
import {Role} from "./Role";

interface UserDeskCreationAttrs {
    user_id: number;
    desk_id: number;
    is_creator?: boolean;
}

@ObjectType()
@Table({tableName: 'user_desk', timestamps: false})
export class UserDesk extends Model<UserDesk, UserDeskCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Field(() => Boolean)
    @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
    is_creator?: boolean;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'user_id_desk_id_unique'})
    user_id: number

    @ForeignKey(() => Desk)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'user_id_desk_id_unique'})
    desk_id: number

    @Field(() => [UserDeskRole])
    @HasMany(() => UserDeskRole)
    user_desk_role: UserDeskRole[];

    @Field(() => [Role])
    @BelongsToMany(() => Role, () => UserDeskRole)
    roles: Array<Role & { UserDeskRole: UserDeskRole }>;
}
