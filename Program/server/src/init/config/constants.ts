export const PORT: number = Number(process.env.PORT) || 4000;
export const __prod__: boolean = process.env.NODE_ENV === 'production';
export const FORGET_PASSWORD_PREFIX = 'forget-password:';
export const CONFIRM_ACCOUNT_PREFIX = 'forget-password:';