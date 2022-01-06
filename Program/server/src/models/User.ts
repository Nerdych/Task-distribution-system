// Core
import { Column, Table, Model, DataType } from 'sequelize-typescript';

interface UserCreationAttrs {
	name: string;
	surname: string;
	email: string;
	password: string;
	date_of_birth?: Date;
	phone?: string;
}

@Table({ tableName: 'users', timestamps: false })
export class User extends Model<User, UserCreationAttrs> {
	@Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
	id!: number;

	@Column({ type: DataType.TEXT, allowNull: false })
	name!: string;

	@Column({ type: DataType.TEXT, allowNull: false })
	surname!: string;

	@Column({ type: DataType.DATE })
	date_of_birth: Date;

	@Column({ type: DataType.TEXT })
	phone: string;

	@Column({ type: DataType.STRING(128), allowNull: false })
	email!: string;

	@Column({ type: DataType.TEXT, allowNull: false })
	password!: string;
}
