// Core
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

// Models
import {UserOrganization} from "../models/UserOrganization";

@ValidatorConstraint()
export class EmployeeFoundConstraint implements ValidatorConstraintInterface {
    validate(id: number) {
        return !!UserOrganization.findOne({where: {id}});
    }
}

export function EmployeeFound(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: EmployeeFoundConstraint,
        });
    };
}