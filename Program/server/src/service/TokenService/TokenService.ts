// Core
import {sign} from "jsonwebtoken";

// Args
import {CreateAccessTokenArgs, CreateRefreshTokenArgs, SaveTokenArgs} from "./args";

// Constants
import {__prod__} from "../../init/config/constants";

class TokenService {
    createAccessToken({userId}: CreateAccessTokenArgs) {
        const token = sign({userId}, process.env.ACCESS_TOKEN_SECRET || 'ACCESS_TOKEN_SECRET', {
            expiresIn: '1d',
        });
        return token;
    }

    createRefreshToken({userId, tokenVersion}: CreateRefreshTokenArgs) {
        const token = sign({userId, tokenVersion}, process.env.REFRESH_TOKEN_SECRET || 'REFRESH_TOKEN_SECRET', {
            expiresIn: '7d',
        });
        return token;
    }

    saveToken({userId, res, tokenVersion}: SaveTokenArgs) {
        res.cookie('jid', this.createRefreshToken({
            userId,
            tokenVersion
        }), {httpOnly: __prod__, maxAge: 7 * 24 * 60 * 60 * 1000});
    }
}

export default new TokenService();