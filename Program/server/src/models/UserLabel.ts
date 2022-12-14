// Core
import {Column, Table, Model, ForeignKey, DataType, BelongsTo} from 'sequelize-typescript';
import {Field, ObjectType} from "type-graphql";

// Models
import {Label} from "./Label";
import {User} from "./User";

interface UserLabelCreationAttrs {
    user_id: number;
    label_id: number;
}

@ObjectType()
@Table({tableName: 'user_label', timestamps: false})
export class UserLabel extends Model<UserLabel, UserLabelCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'user_id_label_id_unique'})
    user_id: number

    @ForeignKey(() => Label)
    @Column({type: DataType.INTEGER, allowNull: false, unique: 'user_id_label_id_unique'})
    label_id: number

    @Field(() => Label)
    @BelongsTo(() => Label)
    label: Label
}
