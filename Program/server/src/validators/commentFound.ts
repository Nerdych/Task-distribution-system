// Core
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

// Models
import {Comment} from "../models/Comment";

@ValidatorConstraint()
export class CommentFoundConstraint implements ValidatorConstraintInterface {
    validate(id: number) {
        return !!Comment.findOne({where: {id}});
    }
}

export function CommentFound(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: CommentFoundConstraint,
        });
    };
}