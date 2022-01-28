// Core
import {Field, InputType, InterfaceType, ObjectType} from "type-graphql";
import {IsDateString, IsEmail, IsNotEmpty, IsPhoneNumber, Length} from "class-validator";

// Models
import {User} from "../../models/User";

// Validators
import {isPassword} from "../../validators/isPassword";
import {IsUserAlreadyExist} from "../../validators/isUserAlreadyExist";

@InterfaceType()
class UserResponse {
    @Field(() => String)
    message!: string;
}

@ObjectType()
export class UserLoginResponse {
    @Field(() => String)
    accessToken!: string
}

@ObjectType({implements: [UserResponse]})
export class UserRegisterResponse extends UserResponse {
};

@ObjectType({implements: [UserResponse]})
export class UserForgotPasswordResponse extends UserResponse {
};

@ObjectType({implements: [UserResponse]})
export class UserChangePasswordResponse extends UserResponse {
};

@ObjectType({implements: [UserResponse]})
export class UserConfirmAccountResponse extends UserResponse {
};

@InputType({description: "Register user data"})
export class RegisterInput implements Partial<User> {
    @Field(() => String)
    @Length(1, 255, {
        message: 'Имя должно быть не меньше 1 знака и не более 255 знаков',
    })
    name!: string;

    @Field(() => String)
    @Length(1, 255, {
        message: 'Фамилия должна быть не меньше 1 знака и не более 255 знаков',
    })
    surname!: string;

    @Field(() => String, {nullable: true})
    @IsDateString({}, {
        message: 'Неверный формат даты'
    })
    date_of_birth?: Date;

    @Field(() => String, {nullable: true})
    @IsPhoneNumber('RU', {
        message: 'Неверный формат номера телефона'
    })
    phone?: string;

    @Field(() => String)
    @IsNotEmpty({
        message: 'Поле email не должно быть пустым'
    })
    @IsEmail({}, {
        message: 'Неверный формат email'
    })
    @IsUserAlreadyExist({
        message: 'Пользователь с таким email уже существует'
    })
    email!: string;

    @Field(() => String)
    @isPassword({
        message: 'Пароль должен быть содержать хотя бы одну цифру, хотя бы одну букву, не иметь пробелов и иметь хотя бы 5 символов'
    })
    password!: string;
}

@InputType({description: "Login user data"})
export class LoginInput implements Partial<User> {
    @Field(() => String)
    @IsNotEmpty({
        message: 'Поле email не должно быть пустым'
    })
    @IsEmail({}, {
        message: 'Неверный формат email'
    })
    email!: string;

    @Field(() => String)
    password!: string;
}

@InputType({description: "Forgot password user data"})
export class ForgotPasswordInput implements Partial<User> {
    @Field(() => String)
    @IsNotEmpty({
        message: 'Поле email не должно быть пустым'
    })
    @IsEmail({}, {
        message: 'Неверный формат email'
    })
    email!: string;
}

@InputType({description: "Change password user data"})
export class ChangePasswordInput {
    @Field(() => String)
    token!: string;

    @Field(() => String)
    @isPassword({
        message: 'Пароль должен быть содержать хотя бы одну цифру, хотя бы одну букву, не иметь пробелов и иметь хотя бы 5 символов'
    })
    newPassword!: string;
}

@InputType({description: "Confirm account user data"})
export class ConfirmAccountInput {
    @Field(() => String)
    token!: string;
}