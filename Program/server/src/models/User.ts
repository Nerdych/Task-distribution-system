// Core
import {Column, Table, Model, DataType, BelongsToMany, HasMany, ForeignKey} from 'sequelize-typescript';
import {Field, ID, ObjectType} from "type-graphql";

// Models
import {Label} from "./Label";
import {UserLabel} from "./UserLabel";
import {Desk} from "./Desk";
import {UserDesk} from "./UserDesk";
import {Organization} from "./Ogranization";
import {UserOrganization} from "./UserOrganization";
import {Message} from "./Message";
import {Comment} from "./Comment";
import {File} from "./File";

interface UserCreationAttrs {
    name: string;
    surname: string;
    email: string;
    password: string;
    date_of_birth?: Date;
    phone?: string;
}

@ObjectType()
@Table({tableName: 'users', timestamps: false})
export class User extends Model<User, UserCreationAttrs> {
    @Field(() => ID)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false})
    name!: string;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false})
    surname!: string;

    @Field(() => String, {nullable: true})
    @Column({type: DataType.DATEONLY})
    date_of_birth?: Date;

    @Field(() => String, {nullable: true})
    @Column({type: DataType.TEXT})
    phone?: string;

    @Field(() => String)
    @Column({type: DataType.STRING(128), allowNull: false, unique: true})
    email!: string;

    @Field(() => Boolean)
    @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
    is_activated!: boolean;

    @ForeignKey(() => File)
    @Column({type: DataType.INTEGER, unique: true})
    file_id?: number

    @Column({type: DataType.TEXT, allowNull: false})
    password!: string;

    @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
    token_version!: number;

    @Field(() => [UserOrganization])
    @HasMany(() => UserOrganization)
    userOrganizations: UserOrganization[];

    @Field(() => [Message], {nullable: true})
    @HasMany(() => Message)
    messages: Message[];

    @Field(() => [Comment], {nullable: true})
    @HasMany(() => Comment)
    comments: Comment[];

    @Field(() => [Label], {nullable: true})
    @BelongsToMany(() => Label, () => UserLabel)
    labels: Array<Label & { UserLabel: UserLabel }>;

    @Field(() => [Desk], {nullable: true})
    @BelongsToMany(() => Desk, () => UserDesk)
    desks: Array<Desk & { UserDesk: UserDesk }>;

    @Field(() => [Organization], {nullable: true})
    @BelongsToMany(() => Organization, () => UserOrganization)
    organizations: Array<Organization & { UserOrganization: UserOrganization }>;
}
