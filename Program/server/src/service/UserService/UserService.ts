// Core
import argon2 from "argon2";
import {v4} from "uuid";
import {ApolloError} from "apollo-server-express";

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
import MailService from "../MailService/MailService";

// Types
import {MyContext} from "../../types";

class UserService {
    async me({payload}: MyContext): Promise<User | null> {
        const user: User | null = await User.findOne({where: {id: payload?.userId}, include: {all: true}});
        return user;
    }

    async register(data: RegisterInput, {cache}: MyContext): Promise<UserRegisterResponse> {
        const hashedPassword: string = await argon2.hash(data.password);

        const user: User = await User.create({...data, password: hashedPassword});

        const token: string = v4();
        cache.set(CONFIRM_ACCOUNT_PREFIX + token, user.id, 1000 * 60 * 60 * 24);

        await MailService.sendMail({
            to: data.email, html: `
               <h1>Регистрация в Системе распределения задач</h1>
               <p>Для подтверждения регистрации перейдите по ссылке</p>
               <a href="http://localhost:3000/user/confirm/${token}">Подтверить регистрацию аккаунта</a>
            `,
            subject: 'Регистрация в системе распределения задач'
        })
        return {message: 'Вы успешно зарегистрировались на сайте Системы распределения задач'};
    }

    async login({email, password}: LoginInput, {res}: MyContext): Promise<UserLoginResponse> {
        const user: User | null = await User.findOne({where: {email}});

        if (!user) {
            throw new ApolloError('Пользователь с таким email не найден', 'ARGUMENT_VALIDATION_ERROR');
        }

        const valid = await argon2.verify(user.password, password);

        if (!valid) {
            throw new ApolloError('Неверный пароль', 'ARGUMENT_VALIDATION_ERROR');
        }

        if (!user.is_activated) {
            throw new ApolloError('Аккаунт ожидает подтверждения на почте', 'ACCOUNT_ERROR');
        }

        tokenService.saveToken({userId: user.id, res, tokenVersion: user.token_version!});

        return {
            accessToken: tokenService.createAccessToken({userId: user.id})
        };
    }

    async forgotPassword({email}: ForgotPasswordInput, {cache}: MyContext): Promise<UserForgotPasswordResponse> {
        const user: User | null = await User.findOne({where: {email}});

        if (!user) {
            throw new ApolloError('Пользователь с таким email не найден', 'ARGUMENT_VALIDATION_ERROR');
        }

        const token: string = v4();
        cache.set(FORGET_PASSWORD_PREFIX + token, user.id, 1000 * 60 * 60 * 24 * 2);

        await MailService.sendMail({
            to: email,
            html: `<a href='http://localhost:3000/user/change-password/${token}'>Ссылка на смену пароля</a>`,
            subject: 'Смена пароля в системе распределения задач'
        });

        return {
            message: 'Письмо отправлено на указанную почту',
        };
    }

    async changePassword({token, newPassword}: ChangePasswordInput, {cache}: MyContext): Promise<UserChangePasswordResponse> {
        const key = FORGET_PASSWORD_PREFIX + token;
        const userId: number | undefined = cache.get(key);

        if (!userId) {
            throw new ApolloError('Время действия ссылки истекло', 'TOKEN_ERROR');
        }

        const user: User | null = await User.findOne({where: {id: userId}});

        if (!user) {
            throw new ApolloError('Пользователь больше не существует', 'TOKEN_ERROR');
        }

        const hashedPassword: string = await argon2.hash(newPassword);
        await user.update({password: hashedPassword});
        cache.del(key);

        await MailService.sendMail({
            to: user.email, html: `
                <h1>Ваш пароль изменен</h1>
                <p>Пароль от вашего аккаунта в Системе распределения задач успешно изменен</p>
            `,
            subject: 'Смена пароля в системе распределения задач'
        });

        return {
            message: "Пароль успешно изменен",
        };
    }

    async confirmAccount({token}: ConfirmAccountInput, {cache}: MyContext): Promise<UserConfirmAccountResponse> {
        const key = CONFIRM_ACCOUNT_PREFIX + token;
        const userId: number | undefined = cache.get(key);

        if (!userId) {
            throw new ApolloError('Время действия ссылки истекло', 'TOKEN_ERROR');
        }

        const user: User | null = await User.findOne({where: {id: userId}});

        if (!user) {
            throw new ApolloError('Пользователь больше не существует', 'TOKEN_ERROR');
        }

        await user.update({is_activated: true});
        cache.del(key);

        await MailService.sendMail({
            to: user.email, html: `
                <h1>Регистрация на сайте Система распределения задач</h1>
                <p>Вы успешно зарегистрировались на нашем сайте</p>
            `,
            subject: "Регистрация в системе распределения задач"
        });

        return {
            message: "Аккаунт успешно подтвреждён",
        };
    }
}

export default new UserService();