// Core
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

// Helpers
import {validatePassword} from "../helpers/validatePassword";

@ValidatorConstraint()
export class isPasswordConstraint implements ValidatorConstraintInterface {
    validate(password: string) {
        return !!validatePassword(password);
    }
}

export function isPassword(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: isPasswordConstraint,
        });
    };
}