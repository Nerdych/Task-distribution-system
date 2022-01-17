// Core
import {Column, Table, Model, ForeignKey, DataType} from 'sequelize-typescript';

// Models
import {DeskRole} from "./DeskRole";
import {DeskRight} from "./DeskRight";

interface DeskRoleDeskRightCreationAttrs {
    desk_role_id: number;
    desk_right_id: number;
}

@Table({tableName: 'desk_role_desk_right', timestamps: false})
export class DeskRoleDeskRight extends Model<DeskRoleDeskRight, DeskRoleDeskRightCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @ForeignKey(() => DeskRole)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'organization_role_id_organization_right_id_unique'})
    desk_role_id: number

    @ForeignKey(() => DeskRight)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'organization_role_id_organization_right_id_unique'})
    desk_right_id: number
}
