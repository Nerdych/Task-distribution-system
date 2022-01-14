// Core
import {JwtPayload, verify} from "jsonwebtoken";
import {Application} from "express";

// Models
import {User} from "../models/User";

// Service
import tokenService from "../service/TokenService";

// Args
import {TokenType} from "../args/token/tokenArgs";

export const addEndpoints = (app: Application): void => {
    app.post('/refresh_token', async (req, res) => {
        const token = req.cookies.jid;

        if (!token) {
            return res.send({ok: false, accessToken: ''});
        }

        let payload: JwtPayload | null = null;
        try {
            payload = verify(token, process.env.REFRESH_TOKEN_SECRET || 'REFRESH_TOKEN_SECRET')
        } catch (e) {
            console.error(e);
            return res.send({ok: false, accessToken: ''});
        }

        const user: User | null = await User.findOne({where: {id: payload.userId}});

        if (!user) {
            return res.send({ok: false, accessToken: ''});
        }

        tokenService.saveToken({userId: user.id, res});
        return res.send({ok: true, accessToken: tokenService.createToken({userId: user.id, type: TokenType.ACCESS})});
    })
    ;
}