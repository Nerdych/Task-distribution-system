// Core
import { Column, Table, Model, DataType, HasMany } from 'sequelize-typescript';

// Models
import { Desk } from './Desk';

interface OrganizationCreationAttrs {
	name: string;
	link_to_invite?: string;
}

@Table({ tableName: 'organizations', timestamps: false })
export class Organization extends Model<Organization, OrganizationCreationAttrs> {
	@Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
	id!: number;

	@Column({ type: DataType.TEXT, allowNull: false })
	name!: string;

	@Column({ type: DataType.TEXT })
	link_to_invite: string;

	@HasMany(() => Desk)
	desks: Desk[];
}
