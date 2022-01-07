// Core
import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 4000;
export const __prod__: boolean = process.env.NODE_ENV === 'production';
