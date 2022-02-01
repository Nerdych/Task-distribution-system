// Core
import {Field, InputType, Int, InterfaceType, ObjectType} from "type-graphql";

// Validators
import {OrganizationFound} from "../../validators/organizationFound";
import {Min} from "class-validator";
import {Label} from "../../models/Label";

@InterfaceType()
class EmployeeResponse {
    @Field(() => String)
    message!: string;
}

@ObjectType({implements: [EmployeeResponse]})
export class CreateEmployeeResponse extends EmployeeResponse {
};

@InputType({description: 'Get all employees data'})
export class GetAllEmployeesInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;
};

@InputType({description: 'Get all employees data'})
export class UpdateEmployeeInput {
    @Field(() => Int)
    @OrganizationFound({
        message: 'Организация с таким индентификатором не найдена'
    })
    orgId!: number;

    @Field(() => Int)
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
    hourly_rate?: number;

    @Field(() => [Label], {nullable: true})
    labels?: Label[];
};