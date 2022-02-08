// Core
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

// Models
import {Card} from "../models/Card";

@ValidatorConstraint()
export class CardFoundConstraint implements ValidatorConstraintInterface {
    validate(id: number) {
        return !!Card.findOne({where: {id}});
    }
}

export function CardFound(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: CardFoundConstraint,
        });
    };
}