// Core
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

// Models
import {Label} from "../models/Label";

@ValidatorConstraint()
export class LabelFoundConstraint implements ValidatorConstraintInterface {
    validate(id: number) {
        return !!Label.findOne({where: {id}});
    }
}

export function LabelFound(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: LabelFoundConstraint,
        });
    };
}