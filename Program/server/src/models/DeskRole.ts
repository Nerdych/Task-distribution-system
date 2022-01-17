// Core
import {Column, Table, Model, DataType, ForeignKey, BelongsTo, BelongsToMany} from 'sequelize-typescript';
import {Field, ID, Int, ObjectType} from "type-graphql";

// Models
import {User} from "./User";
import {Desk} from "./Desk";
import {UserDeskRole} from "./UserDeskRole";
import {DeskRight} from "./DeskRight";
import {DeskRoleDeskRight} from "./DeskRoleDeskRight";

interface DeskRoleCreationAttrs {
    name: string;
    desk_id: number;
}

@ObjectType()
@Table({tableName: 'desks_roles', timestamps: false})
export class DeskRole extends Model<DeskRole, DeskRoleCreationAttrs> {
    @Field(() => ID)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false, unique: 'name_desk_id_unique'})
    name!: string;

    @Field(() => Int)
    @ForeignKey(() => Desk)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'name_desk_id_unique'})
    desk_id!: number;

    @Field(() => Desk)
    @BelongsTo(() => Desk)
    desk: Desk;

    @Field(() => [DeskRight], {nullable: true})
    @BelongsToMany(() => DeskRight, () => DeskRoleDeskRight)
    desks_rights: Array<DeskRight & { DeskRoleDeskRight: DeskRoleDeskRight }>;

    @Field(() => [User], {nullable: true})
    @BelongsToMany(() => User, () => UserDeskRole)
    users: Array<User & { UserDeskRole: UserDeskRole }>;
}
