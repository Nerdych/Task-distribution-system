// Core
import {Field, InputType, ObjectType} from "type-graphql";

// Models
import {User} from "../../models/User";

@ObjectType()
export class FieldError {
    @Field(() => String)
    field!: string

    @Field(() => String)
    message!: string
}

@ObjectType()
export class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => User, {nullable: true})
    user?: User
}

@ObjectType()
export class UserLoginResponse {
    @Field(() => String)
    accessToken!: string
}

@ObjectType()
export class UserForgotPasswordResponse {
    @Field(() => String)
    message!: string

    @Field(() => Boolean)
    isMailSent!: boolean
}

@ObjectType()
export class UserChangePasswordResponse {
    @Field()
    message!: string

    @Field()
    isChangePassword!: boolean
}

@InputType({description: "Register user data"})
export class RegisterInput implements Partial<User> {
    @Field(() => String)
    name!: string;

    @Field(() => String)
    surname!: string;

    @Field(() => String, {nullable: true})
    date_of_birth?: Date;

    @Field(() => String, {nullable: true})
    phone?: string;

    @Field(() => String)
    email!: string;

    @Field(() => String)
    password!: string;
}

@InputType({description: "Login user data"})
export class LoginInput implements Partial<User> {
    @Field(() => String)
    email!: string;

    @Field(() => String)
    password!: string;
}

@InputType({description: "Forgot password user data"})
export class ForgotPasswordInput implements Partial<User> {
    @Field(() => String)
    email!: string;
}

@InputType({description: "Change password user data"})
export class ChangePasswordInput {
    @Field(() => String)
    token!: string;

    @Field(() => String)
    newPassword!: string;
}