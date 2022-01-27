// Core
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

// Models
import {Desk} from "../models/Desk";

@ValidatorConstraint()
export class DeskFoundConstraint implements ValidatorConstraintInterface {
    validate(id: number) {
        return !!Desk.findOne({where: {id}});
    }
}

export function DeskFound(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: DeskFoundConstraint,
        });
    };
}