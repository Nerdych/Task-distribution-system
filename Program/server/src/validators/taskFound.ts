// Core
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

// Models
import {Task} from "../models/Task";

@ValidatorConstraint()
export class TaskFoundConstraint implements ValidatorConstraintInterface {
    validate(id: number) {
        return !!Task.findOne({where: {id}});
    }
}

export function TaskFound(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: TaskFoundConstraint,
        });
    };
}