// Core
import {Column, Table, Model, DataType, HasMany} from 'sequelize-typescript';
import {Field, ID, ObjectType} from "type-graphql";

// Models
import {Right} from "./Right";

interface ObjectTableCreationAttrs {
    name: string;
    code: string;
}

@ObjectType()
@Table({tableName: 'objects', timestamps: false})
export class ObjectTable extends Model<ObjectTable, ObjectTableCreationAttrs> {
    @Field(() => ID)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false, unique: true})
    name!: string;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false, unique: true})
    code!: string;

    @Field(() => [Right])
    @HasMany(() => Right)
    rights: Right[];
}
