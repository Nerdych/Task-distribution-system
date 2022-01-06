// Core
import { Column, Table, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';

// Models
import { ColumnTable } from './Column';
import { Organization } from './Ogranization';

interface DeskCreationAttrs {
	name: string;
	organization_id: number;
}

@Table({ tableName: 'desks', timestamps: false })
export class Desk extends Model<Desk, DeskCreationAttrs> {
	@Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
	id!: number;

	@Column({ type: DataType.TEXT, allowNull: false })
	name!: string;

	@ForeignKey(() => Organization)
	@Column({ type: DataType.INTEGER, allowNull: false })
	organization_id!: number;

	@BelongsTo(() => Organization)
	organization: Organization;

	@HasMany(() => ColumnTable)
	columns: ColumnTable[];
}
