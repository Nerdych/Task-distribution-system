// Core
import {Column, Table, Model, ForeignKey, DataType} from 'sequelize-typescript';

// Models
import {Desk} from "./Desk";
import {File} from "./File";

interface DeskFileCreationAttrs {
    file_id: number;
    desk_id: number;
}

@Table({tableName: 'desk_file', timestamps: false})
export class DeskFile extends Model<DeskFile, DeskFileCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @ForeignKey(() => File)
    @Column({type: DataType.INTEGER, allowNull: false, unique: true})
    file_id!: number

    @ForeignKey(() => Desk)
    @Column({type: DataType.INTEGER, allowNull: false})
    desk_id!: number
}
