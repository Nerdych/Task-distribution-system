// Core
import {Column, Table, Model, DataType, ForeignKey, BelongsTo, BelongsToMany} from 'sequelize-typescript';

// Models
import {Organization} from './Ogranization';
import {Right} from "./Right";
import {RoleRight} from "./RoleRight";
import {LabelCard} from "./LabelCard";
import {Card} from "./Card";

interface LabelCreationAttrs {
    title: string;
    color: string;
    organization_id: number;
}

@Table({tableName: 'labels', timestamps: false})
export class Label extends Model<Label, LabelCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Column({type: DataType.TEXT, allowNull: false})
    title!: string;

    @Column({type: DataType.CHAR(6), allowNull: false})
    color!: string;

    @ForeignKey(() => Organization)
    @Column({type: DataType.INTEGER, allowNull: false})
    organization_id!: number;

    @BelongsTo(() => Organization)
    organization: Organization;

    @BelongsToMany(() => Card, () => LabelCard)
    cards: Array<Card & { LabelCard: LabelCard }>;
}
