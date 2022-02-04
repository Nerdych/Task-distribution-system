// Core
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

// Models
import {ColumnTable} from "../models/Column";

@ValidatorConstraint()
export class ColumnFoundConstraint implements ValidatorConstraintInterface {
    validate(id: number) {
        return !!ColumnTable.findOne({where: {id}});
    }
}

export function ColumnFound(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: ColumnFoundConstraint,
        });
    };
}