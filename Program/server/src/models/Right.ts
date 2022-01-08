// Core
import {Column, Table, Model, DataType, ForeignKey, BelongsTo, BelongsToMany} from 'sequelize-typescript';
import {Field, ID, ObjectType} from "type-graphql";

// Models
import {Role} from "./Role";
import {RoleRight} from "./RoleRight";

interface RightCreationAttrs {
    name: string;
}

@ObjectType()
@Table({tableName: 'rights', timestamps: false})
export class Right extends Model<Right, RightCreationAttrs> {
    @Field(() => ID)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false, unique: true})
    name!: string;

    @Field(() => Role, {nullable: true})
    @BelongsToMany(() => Role, () => RoleRight)
    roles: Array<Role & { RoleRight: RoleRight }>;
}
