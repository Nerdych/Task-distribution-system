// Core
import {Column, Table, Model, DataType, BelongsToMany, HasMany} from 'sequelize-typescript';

// Models
import {Label} from "./Label";
import {UserLabel} from "./UserLabel";
import {Role} from "./Role";
import {UserRole} from "./UserRole";
import {Desk} from "./Desk";
import {UserDesk} from "./UserDesk";
import {Organization} from "./Ogranization";
import {UserOrganization} from "./UserOrganization";
import {Message} from "./Message";

interface UserCreationAttrs {
    name: string;
    surname: string;
    email: string;
    password: string;
    date_of_birth?: Date;
    phone?: string;
}

@Table({tableName: 'users', timestamps: false})
export class User extends Model<User, UserCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Column({type: DataType.TEXT, allowNull: false})
    name!: string;

    @Column({type: DataType.TEXT, allowNull: false})
    surname!: string;

    @Column({type: DataType.DATEONLY})
    date_of_birth: Date;

    @Column({type: DataType.TEXT})
    phone: string;

    @Column({type: DataType.STRING(128), allowNull: false, unique: true})
    email!: string;

    @Column({type: DataType.TEXT, allowNull: false})
    password!: string;

    @BelongsToMany(() => Label, () => UserLabel)
    rights: Array<Label & { UserLabel: UserLabel }>;

    @BelongsToMany(() => Role, () => UserRole)
    roles: Array<Role & { UserRole: UserRole }>;

    @BelongsToMany(() => Desk, () => UserDesk)
    desks: Array<Desk & { UserDesk: UserDesk }>;

    @BelongsToMany(() => Organization, () => UserOrganization)
    organizations: Array<Organization & { UserOrganization: UserOrganization }>;

    @HasMany(() => Message)
    messages: Message[];
}
