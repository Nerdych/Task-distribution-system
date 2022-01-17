// Core
import argon2 from "argon2";
import {v4} from "uuid";

// Args
import {
    ChangePasswordInput, ConfirmAccountInput,
    ForgotPasswordInput,
    LoginInput,
    RegisterInput, UserChangePasswordResponse, UserConfirmAccountResponse,
    UserForgotPasswordResponse,
    UserLoginResponse,
    UserRegisterResponse
} from "./args";

// Models
import {User} from "../../models/User";

// Constants
import {FORGET_PASSWORD_PREFIX, CONFIRM_ACCOUNT_PREFIX} from "../../init/config/constants";

// Service
import tokenService from "../TokenService/TokenService";
import MailService from "../MailService/TokenService";

// Types
import {MyContext} from "../../types";

class UserService {
    async me({payload}: MyContext): Promise<User | null> {
        const user: User | null = await User.findOne({where: {id: payload?.userId}});
        return user;
    }

    async register(data: RegisterInput, {cache}: MyContext): Promise<UserRegisterResponse> {
        const hashedPassword: string = await argon2.hash(data.password);

        const user: User | null = await User.create({...data, password: hashedPassword});

        const token: string = v4();
        cache.set(CONFIRM_ACCOUNT_PREFIX + token, user.id, 1000 * 60 * 60 * 24);

        await MailService.sendMail({
            to: data.email, html: `
               <h1>Регистрация в Системе распределения задач</h1>
               <p>Для подтверждения регистрации перейдите по ссылке</p>
               <a href="http://localhost:3000/user/confirm/${token}">Подтверить регистрацию аккаунта</a>
            `
        })
        return {message: 'Вы успешно зарегистрировались на сайте Системы распределения задач'};
    }

    async login({email, password}: LoginInput, {res}: MyContext): Promise<UserLoginResponse> {
        const user: User | null = await User.findOne({where: {email}});

        if (!user) {
            throw new Error('Пользователь с таким email не найден');
        }

        const valid = await argon2.verify(user.password, password);

        if (!valid) {
            throw new Error('Неверный пароль');
        }

        if (!user.is_activated) {
            throw new Error('Аккаунт ожидает подтверждения на почте');
        }

        tokenService.saveToken({userId: user.id, res, tokenVersion: user.token_version!});

        return {
            accessToken: tokenService.createAccessToken({userId: user.id})
        };
    }

    async forgotPassword({email}: ForgotPasswordInput, {cache}: MyContext): Promise<UserForgotPasswordResponse> {
        const user: User | null = await User.findOne({where: {email}});

        if (!user) {
            throw new Error('Пользователь с таким email не найден');
        }

        const token: string = v4();
        cache.set(FORGET_PASSWORD_PREFIX + token, user.id, 1000 * 60 * 60 * 24 * 2);

        await MailService.sendMail({
            to: email,
            html: `<a href='http://localhost:3000/user/change-password/${token}'>Ссылка на смену пароля</a>`
        });

        return {
            message: 'Письмо отправлено на указанную почту',
        };
    }

    async changePassword({token, newPassword}: ChangePasswordInput, {cache}: MyContext): Promise<UserChangePasswordResponse> {
        const key = FORGET_PASSWORD_PREFIX + token;
        const userId: number | undefined = cache.get(key);

        if (!userId) {
            throw new Error('Время действия ссылки истекло');
        }

        const user: User | null = await User.findOne({where: {id: userId}});

        if (!user) {
            throw new Error('Пользователь больше не существует');
        }

        const hashedPassword: string = await argon2.hash(newPassword);
        await user.update({password: hashedPassword});
        cache.del(key);

        await MailService.sendMail({
            to: user.email, html: `
                <h1>Ваш пароль изменен</h1>
                <p>Пароль от вашего аккаунта в Системе распределения задач успешно изменен</p>
            `
        });

        return {
            message: "Пароль успешно изменен",
        };
    }

    async confirmAccount({token}: ConfirmAccountInput, {cache}: MyContext): Promise<UserConfirmAccountResponse> {
        const key = CONFIRM_ACCOUNT_PREFIX + token;
        const userId: number | undefined = cache.get(key);

        if (!userId) {
            throw new Error('Время действия ссылки истекло');
        }

        const user: User | null = await User.findOne({where: {id: userId}});

        if (!user) {
            throw new Error('Пользователь больше не существует');
        }

        await user.update({is_activated: true});
        cache.del(key);

        await MailService.sendMail({
            to: user.email, html: `
                <h1>Регистрация на сайте Система распределения задач</h1>
                <p>Вы успешно зарегистрировались на нашем сайте</p>
            `
        });

        return {
            message: "Аккаунт успешно подтвреждён",
        };
    }
}

export default new UserService();