// Core
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

// Models
import {List} from "../models/List";

@ValidatorConstraint()
export class ListFoundConstraint implements ValidatorConstraintInterface {
    validate(id: number) {
        return !!List.findOne({where: {id}});
    }
}

export function ListFound(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: ListFoundConstraint,
        });
    };
}