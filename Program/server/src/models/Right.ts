// Core
import {Column, Table, Model, DataType, ForeignKey, BelongsTo, BelongsToMany} from 'sequelize-typescript';

// Models
import {Role} from "./Role";
import {RoleRight} from "./RoleRight";

interface RightCreationAttrs {
    name: string;
}

@Table({tableName: 'rights', timestamps: false})
export class Right extends Model<Right, RightCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Column({type: DataType.TEXT, allowNull: false, unique: true})
    name!: string;

    @BelongsToMany(() => Role, () => RoleRight)
    roles: Array<Role & {RoleRight: RoleRight}>;
}
