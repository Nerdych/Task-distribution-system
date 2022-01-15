// Core
import argon2 from "argon2";
import {v4} from "uuid";

// Args
import {
    ChangePasswordInput,
    ForgotPasswordInput,
    LoginInput,
    RegisterInput, UserChangePasswordResponse,
    UserForgotPasswordResponse,
    UserLoginResponse,
    UserResponse
} from "../args/user/userArgs";

// Models
import {User} from "../models/User";

// Constants
import {FORGET_PASSWORD_PREFIX} from "../init/config/constants";

// Service
import tokenService from "./TokenService";
import MailService from "./MailService";

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
            await MailService.sendMail({to: data.email, html: `
                <h1>Регистрация в Системе распределения задач</h1>
                <p>Вы успешно зарегистрировались в системе</p>
            `})
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

    async forgotPassword({email}: ForgotPasswordInput, {cache}: MyContext): Promise<UserForgotPasswordResponse> {
        if (!validateEmail(email)) {
            return {
                message: 'Некорректный email',
                isMailSent: false
            }
        }

        const user: User | null = await User.findOne({where: {email}});

        if (!user) {
            return {
                message: 'Пользователь с таким email не найден',
                isMailSent: false
            }
        }

        const token: string = v4();
        cache.set(FORGET_PASSWORD_PREFIX + token, user.id, 1000 * 60 * 60 * 24 * 2);

        await MailService.sendMail({
            to: email,
            html: `<a href='http://localhost:3000/change-password/${token}'>Ссылка на смену пароля</a>`
        });

        return {
            message: 'Письмо отправлено на указанную почту',
            isMailSent: true
        };
    }

    async changePassword({token, newPassword}: ChangePasswordInput, {cache}: MyContext): Promise<UserChangePasswordResponse> {
        if (!validatePassword(newPassword)) {
            return {
                message: "Невалидный пароль",
                isChangePassword: false
            };
        }

        const key = FORGET_PASSWORD_PREFIX + token;
        const userId: number | undefined = cache.get(key);

        if (!userId) {
            return {
                message: "Время действия ссылки истекло",
                isChangePassword: false
            };
        }

        const user: User | null = await User.findOne({where: {id: userId}});

        if (!user) {
            return {
                message: "Пользователь больше не существует",
                isChangePassword: false
            };
        }

        const hashedPassword: string = await argon2.hash(newPassword);
        await user.update({password: hashedPassword});
        cache.del(key);

        await MailService.sendMail({to: user.email, html: `
            <h1>Ваш пароль изменен</h1>
            <p>Пароль от вашего аккаунта в Системе распределения задач успешно изменен</p>
        `})

        return {
            message: "Пароль успешно изменен",
            isChangePassword: true
        };
    }
}

export default new UserService();