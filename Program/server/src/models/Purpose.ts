// Core
import {Column, Table, Model, DataType, HasMany} from 'sequelize-typescript';
import {Field, ID, ObjectType} from "type-graphql";

// Models
import {Right} from "./Right";
import {Role} from "./Role";

interface PurposeCreationAttrs {
    name: string;
}

enum PurposeName {
    organization,
    desk
}

@ObjectType()
@Table({tableName: 'purpose', timestamps: false})
export class Purpose extends Model<Purpose, PurposeCreationAttrs> {
    @Field(() => ID)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Field(() => String)
    @Column({type: DataType.ENUM('organization', 'desk'), allowNull: false, unique: true})
    name!: PurposeName;

    @Field(() => [Right], {nullable: true})
    @HasMany(() => Right)
    rights: Right[];

    @Field(() => [Role], {nullable: true})
    @HasMany(() => Role)
    roles: Role[];
}
