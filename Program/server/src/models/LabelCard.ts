// Core
import {Column, Table, Model, ForeignKey, DataType} from 'sequelize-typescript';

// Models
import {Label} from "./Label";
import {Card} from "./Card";

interface LabelCardCreationAttrs {
    label_id: number;
    card_id: number;
}

@Table({tableName: 'label_card', timestamps: false})
export class LabelCard extends Model<LabelCard, LabelCardCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @ForeignKey(() => Label)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'label_id_card_id_unique'})
    label_id: number

    @ForeignKey(() => Card)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'label_id_card_id_unique'})
    card_id: number
}
