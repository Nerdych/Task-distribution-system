// Core
import {CorsOptions} from 'cors';

export const corsConfig: CorsOptions = {
    origin: 'http://localhost:5000/graphql',
    credentials: true,
};
