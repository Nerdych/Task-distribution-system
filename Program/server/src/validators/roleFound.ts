// Core
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

// Models
import {Role} from "../models/Role";

@ValidatorConstraint()
export class RoleFoundConstraint implements ValidatorConstraintInterface {
    validate(id: number) {
        return !!Role.findOne({where: {id}});
    }
}

export function RoleFound(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: RoleFoundConstraint,
        });
    };
}