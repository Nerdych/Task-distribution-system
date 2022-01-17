// Core
import {JwtPayload, verify} from "jsonwebtoken";
import {Application} from "express";

// Models
import {User} from "../models/User";

// Service
import tokenService from "../service/TokenService/TokenService";

export const addEndpoints = (app: Application): void => {
    app.post('/refresh_token', async (req, res) => {
        console.log(req.cookies)
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

        if (user.token_version !== payload.tokenVersion) {
            return res.send({ok: false, accessToken: ''});
        }

        tokenService.saveToken({userId: user.id, tokenVersion: user.token_version || 0, res});
        return res.send({ok: true, accessToken: tokenService.createAccessToken({userId: user.id})});
    })
    ;
}