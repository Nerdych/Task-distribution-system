// Core
import {Response} from "express";

export interface CreateAccessTokenArgs {
    userId: number
}

export interface CreateRefreshTokenArgs {
    userId: number,
    tokenVersion: number
}

export interface SaveTokenArgs {
    userId: number,
    tokenVersion: number,
    res: Response
}

