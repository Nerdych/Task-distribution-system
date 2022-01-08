// Core
import {Column, Table, Model, DataType, ForeignKey, BelongsTo, BelongsToMany} from 'sequelize-typescript';
import {Field, ID, Int, ObjectType} from "type-graphql";

// Models
import {Organization} from './Ogranization';
import {LabelCard} from "./LabelCard";
import {Card} from "./Card";

interface LabelCreationAttrs {
    title: string;
    color: string;
    organization_id: number;
}

@ObjectType()
@Table({tableName: 'labels', timestamps: false})
export class Label extends Model<Label, LabelCreationAttrs> {
    @Field(() => ID)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false})
    title!: string;

    @Field(() => String)
    @Column({type: DataType.CHAR(6), allowNull: false})
    color!: string;

    @Field(() => Int)
    @ForeignKey(() => Organization)
    @Column({type: DataType.INTEGER, allowNull: false})
    organization_id!: number;

    @Field(() => Organization)
    @BelongsTo(() => Organization)
    organization: Organization;

    @Field(() => [Card], {nullable: true})
    @BelongsToMany(() => Card, () => LabelCard)
    cards: Array<Card & { LabelCard: LabelCard }>;
}
