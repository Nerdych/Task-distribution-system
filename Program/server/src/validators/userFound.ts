// Core
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

// Models
import {User} from "../models/User";

@ValidatorConstraint()
export class UserFoundConstraint implements ValidatorConstraintInterface {
    validate(id: number) {
        return !!User.findOne({where: {id}});
    }
}

export function UserFound(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: UserFoundConstraint,
        });
    };
}