// Core
import {Column, Table, Model, DataType, ForeignKey, BelongsTo, HasMany, BelongsToMany} from 'sequelize-typescript';

// Models
import {Organization} from './Ogranization';
import {Right} from "./Right";
import {RoleRight} from "./RoleRight";
import {UserRole} from "./UserRole";
import {User} from "./User";

interface RoleCreationAttrs {
    name: string;
    organization_id: number;
}

@Table({tableName: 'roles', timestamps: false})
export class Role extends Model<Role, RoleCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Column({type: DataType.TEXT, allowNull: false, unique: 'name_organization_id_unique'})
    name!: string;

    @ForeignKey(() => Organization)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'name_organization_id_unique'})
    organization_id!: number;

    @BelongsTo(() => Organization)
    organization: Organization;

    @BelongsToMany(() => Right, () => RoleRight)
    rights: Array<Right & {RoleRight: RoleRight}>;

    @BelongsToMany(() => User, () => UserRole)
    users: Array<User & { UserRole: UserRole }>;
}
