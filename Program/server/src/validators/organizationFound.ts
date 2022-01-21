// Core
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

// Models
import {Organization} from "../models/Ogranization";

@ValidatorConstraint()
export class OrganizationFoundConstraint implements ValidatorConstraintInterface {
    validate(id: number) {
        return !!Organization.findOne({where: {id}});
    }
}

export function OrganizationFound(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: OrganizationFoundConstraint,
        });
    };
}