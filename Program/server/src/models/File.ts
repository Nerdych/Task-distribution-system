// Core
import {Column, Table, Model, DataType} from 'sequelize-typescript';
import {Field, ID, ObjectType} from "type-graphql";

interface FileCreationAttrs {
    url: string;
    description: string;
}

@ObjectType()
@Table({tableName: 'files', timestamps: false})
export class File extends Model<File, FileCreationAttrs> {
    @Field(() => ID)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false, unique: true})
    url!: string;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false})
    description!: string;
}
