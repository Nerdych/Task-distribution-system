// Core
import {Field, InputType, Int, InterfaceType, ObjectType} from "type-graphql";
import {Min} from "class-validator";

// Validators
import {OrganizationFound} from "../../validators/organizationFound";
import {EmployeeFound} from "../../validators/employeeFound";
import {UserFound} from "../../validators/userFound";

@InterfaceType()
class EmployeeResponse {
    @Field(() => String)
    message!: string;
}

@ObjectType({implements: [EmployeeResponse]})
export class CreateEmployeeResponse extends EmployeeResponse {
};

@ObjectType({implements: [EmployeeResponse]})
export class UpdateEmployeeResponse extends EmployeeResponse {
};

@ObjectType({implements: [EmployeeResponse]})
export class AddEmployeeResponse extends EmployeeResponse {
};

@ObjectType({implements: [EmployeeResponse]})
export class InviteUserOrganizationResponse extends EmployeeResponse {
};

@ObjectType({implements: [EmployeeResponse]})
export class DeleteEmployeeResponse extends EmployeeResponse {
};

@InputType({description: 'Get all employees data'})
export class GetAllEmployeesInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;
};

@InputType({description: 'Get one employee data'})
export class GetOneEmployeeInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;

    @Field(() => Int)
    @EmployeeFound({
        message: 'Сотрудник с таким индентификатором не найден'
    })
    employeeId!: number;
};

@InputType({description: 'Get all employees data'})
export class UpdateEmployeeInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;

    @Field(() => Int)
    @EmployeeFound({
        message: 'Сотрудник с таким индентификатором не найден'
    })
    employeeId!: number;

    @Field(() => Int, {nullable: true})
    @Min(0, {
        message: 'Опыт сотрудника не может быть меньше 0'
    })
    experience?: number;

    @Field(() => Int, {nullable: true})
    @Min(1, {
        message: 'Ставка сотрудника не может быть меньше 1'
    })
    hourlyRate?: number;

    @Field(() => Boolean, {nullable: true})
    isVacation?: boolean;

    @Field(() => [Int], {nullable: true})
    labels?: number[];

    @Field(() => [Int], {nullable: true})
    roles?: number[];
};

@InputType({description: 'Add employee data'})
export class AddEmployeeInput {
    @Field(() => String)
    token!: string;
};

@InputType({description: 'Delete employee data'})
export class DeleteEmployeeInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;

    @Field(() => Int)
    @EmployeeFound({
        message: 'Сотрудник с таким индентификатором не найден'
    })
    employeeId!: number;
};

@InputType({description: 'Invite user organization data'})
export class InviteUserOrganizationInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;

    @Field(() => Int)
    @UserFound({
        message: 'Пользователь с таким индентификатором не найден'
    })
    userId!: number;

    @Field(() => Int, {nullable: true})
    @Min(0, {
        message: 'Опыт сотрудника не может быть меньше 0'
    })
    experience?: number;

    @Field(() => Int, {nullable: true})
    @Min(1, {
        message: 'Ставка сотрудника не может быть меньше 1'
    })
    hourlyRate?: number;

    @Field(() => Boolean, {nullable: true})
    isVacation?: boolean;

    @Field(() => [Int], {nullable: true})
    roles?: number[];
};