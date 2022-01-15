// Core
import {Response} from "express";

export interface AccessTokenCreateArgs {
    userId: number
}

export interface RefreshTokenCreateArgs {
    userId: number,
    tokenVersion: number
}

export interface TokenSaveArgs {
    userId: number,
    tokenVersion: number,
    res: Response
}

