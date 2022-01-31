// Core
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

// Models
import {Purpose} from "../models/Purpose";

@ValidatorConstraint()
export class PurposeFoundConstraint implements ValidatorConstraintInterface {
    validate(id: number) {
        return !!Purpose.findOne({where: {id}});
    }
}

export function PurposeFound(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: PurposeFoundConstraint,
        });
    };
}