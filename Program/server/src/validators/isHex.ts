// Core
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

// Helpers
import {validateHex} from "../helpers/validateHex";

@ValidatorConstraint()
export class isHexConstraint implements ValidatorConstraintInterface {
    validate(color: string) {
        return !!validateHex(color);
    }
}

export function isHex(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: isHexConstraint,
        });
    };
}