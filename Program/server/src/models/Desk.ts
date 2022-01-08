// Core
import {Column, Table, Model, DataType, ForeignKey, BelongsTo, HasMany, BelongsToMany} from 'sequelize-typescript';
import {Field, ID, Int, ObjectType} from "type-graphql";

// Models
import {ColumnTable} from './Column';
import {Organization} from './Ogranization';
import {UserDesk} from "./UserDesk";
import {User} from "./User";
import {Message} from "./Message";

interface DeskCreationAttrs {
    name: string;
    organization_id: number;
}

@ObjectType()
@Table({tableName: 'desks', timestamps: false})
export class Desk extends Model<Desk, DeskCreationAttrs> {
    @Field(() => ID)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false})
    name!: string;

    @Field(() => Int)
    @ForeignKey(() => Organization)
    @Column({type: DataType.INTEGER, allowNull: false})
    organization_id!: number;

    @Field(() => Organization)
    @BelongsTo(() => Organization)
    organization: Organization;

    @Field(() => [ColumnTable], {nullable: true})
    @HasMany(() => ColumnTable)
    columns: ColumnTable[];

    @HasMany(() => Message)
    messages: Message[];

    @BelongsToMany(() => User, () => UserDesk)
    users: Array<User & { UserDesk: UserDesk }>;
}
