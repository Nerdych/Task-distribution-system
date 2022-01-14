// Core
import {sign} from "jsonwebtoken";

// Args
import {TokenCreateArgs, TokenSaveArgs, TokenType} from "../args/token/tokenArgs";

// Constants
import {__prod__} from "../init/config/constants";

class TokenService {
    createToken({userId, type}: TokenCreateArgs): string {
        const secret: string = type === TokenType.ACCESS ? process.env.ACCESS_TOKEN_SECRET || 'ACCESS_TOKEN_SECRET' : process.env.REFRESH_TOKEN_SECRET || 'REFRESH_TOKEN_SECRET';
        const expiresIn: string = type === TokenType.ACCESS ? '15m' : '7d';
        const token = sign({userId}, secret, {
            expiresIn,
        });
        return token;
    }

    saveToken({userId, res}: TokenSaveArgs) {
        res.cookie('jid', this.createToken({
            userId,
            type: TokenType.REFRESH
        }), {httpOnly: __prod__, sameSite: "none", secure: true, maxAge: 7 * 24 * 60 * 60 * 1000});
    }
}

export default new TokenService();