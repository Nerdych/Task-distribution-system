// Core
import {sign} from "jsonwebtoken";

// Args
import {AccessTokenCreateArgs, RefreshTokenCreateArgs, TokenSaveArgs} from "../args/token/tokenArgs";

// Constants
import {__prod__} from "../init/config/constants";

class TokenService {
    createAccessToken({userId}: AccessTokenCreateArgs) {
        const token = sign({userId}, process.env.ACCESS_TOKEN_SECRET || 'ACCESS_TOKEN_SECRET', {
            expiresIn: '15m',
        });
        return token;
    }

    createRefreshToken({userId, tokenVersion}: RefreshTokenCreateArgs) {
        const token = sign({userId, tokenVersion}, process.env.REFRESH_TOKEN_SECRET || 'REFRESH_TOKEN_SECRET', {
            expiresIn: '7d',
        });
        return token;
    }

    saveToken({userId, res, tokenVersion}: TokenSaveArgs) {
        res.cookie('jid', this.createRefreshToken({
            userId,
            tokenVersion
        }), {httpOnly: __prod__, maxAge: 7 * 24 * 60 * 60 * 1000});
    }
}

export default new TokenService();