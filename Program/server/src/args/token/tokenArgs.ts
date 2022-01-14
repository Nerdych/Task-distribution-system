// Core
import {Response} from "express";

export enum TokenType {
    REFRESH,
    ACCESS
}

export interface TokenCreateArgs {
    userId: number,
    type: TokenType,
}

export interface TokenSaveArgs {
    userId: number,
    res: Response
}



