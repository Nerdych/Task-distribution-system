// Core
import {Field, InputType, ObjectType} from "type-graphql";

// Models
import {User} from "../../models/User";

@ObjectType()
export class FieldError {
    @Field(() => String)
    field: string

    @Field(() => String)
    message: string
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
    @Field()
    accessToken: string
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