// Core
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

// Models
import {User} from "../models/User";

@ValidatorConstraint({async: true})
export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {
    async validate(email: string) {
        const user = await User.findOne({where: {email}});
        if (user) return false;
        return true;
    }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUserAlreadyExistConstraint,
        });
    };
}