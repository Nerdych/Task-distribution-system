// Core
import argon2 from "argon2";

// Args
import {LoginInput, RegisterInput, UserLoginResponse, UserResponse} from "../args/user/userArgs";

// Models
import {User} from "../models/User";

// Service
import tokenService from "./TokenService";

// Helpers
import {validatePassword} from "../helpers/validatePassword";
import {validateEmail} from "../helpers/validateEmail";

// Types
import {MyContext} from "../types";

class UserService {
    async register(data: RegisterInput): Promise<UserResponse> {
        if (!validatePassword(data.password)) {
            return {
                errors: [{
                    field: 'password',
                    message: 'The password must contain at least one digit, at least one lowercase letter, no spaces and have at least 5 digits '
                }]
            };
        }

        const hashedPassword: string = await argon2.hash(data.password);

        if (await User.findOne({where: {email: data.email}})) {
            return {
                errors: [{field: 'email', message: 'User with this email already exist'}]
            };
        }

        if (!validateEmail(data.email)) {
            return {
                errors: [{field: 'email', message: 'Incorrect email'}]
            };
        }

        try {
            const createdUser: User = await User.create({...data, password: hashedPassword});
            return {user: createdUser};
        } catch (e) {
            console.error(e);
            return {
                errors: [{field: 'no-field', message: 'Something wrong...'}]
            };
        }
    }

    async login(data: LoginInput, {res}: MyContext): Promise<UserLoginResponse> {
        const user: User | null = await User.findOne({where: {email: data.email}});

        if (!user) {
            throw new Error('User with this email not found');
        }

        const valid = await argon2.verify(user.password, data.password);

        if (!valid) {
            throw new Error('Incorrect password');
        }

        tokenService.saveToken({userId: user.id, res, tokenVersion: user.token_version!});

        return {
            accessToken: tokenService.createAccessToken({userId: user.id})
        };
    }

    async me(): Promise<User | null> {
        const user: User | null = await User.findOne({where: {id: 1}});
        return user;
    }
}

export default new UserService();