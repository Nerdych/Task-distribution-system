// Core
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

// Models
import {Message} from "../models/Message";

@ValidatorConstraint()
export class MessageFoundConstraint implements ValidatorConstraintInterface {
    validate(id: number) {
        return !!Message.findOne({where: {id}});
    }
}

export function MessageFound(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: MessageFoundConstraint,
        });
    };
}