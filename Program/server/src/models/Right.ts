// Core
import {Column, Table, Model, DataType, ForeignKey, BelongsToMany, BelongsTo} from 'sequelize-typescript';
import {Field, ID, ObjectType} from "type-graphql";

// Models
import {Role} from "./Role";
import {Purpose} from "./Purpose";
import {RoleRight} from "./RoleRight";

interface RightCreationAttrs {
    name: string;
    code: string;
    purpose_id: number;
}

@ObjectType()
@Table({tableName: 'rights', timestamps: false})
export class Right extends Model<Right, RightCreationAttrs> {
    @Field(() => ID)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false, unique: 'name_purpose_id_unique'})
    name!: string;

    @Field(() => String)
    @Column({type: DataType.TEXT, allowNull: false})
    code!: string;

    @Field(() => String)
    @ForeignKey(() => Purpose)
    @Column({type: DataType.TEXT, allowNull: false, unique: 'name_purpose_id_unique'})
    purpose_id!: number;

    @Field(() => Purpose)
    @BelongsTo(() => Purpose)
    purpose: Purpose;

    @Field(() => [Role], {nullable: true})
    @BelongsToMany(() => Role, () => RoleRight)
    roles: Array<Role & { RoleRight: RoleRight }>;
}
