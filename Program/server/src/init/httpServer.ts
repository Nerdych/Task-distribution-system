// Core
import {createServer, Server} from "http";
import {Application} from "express";

interface startHttpServerArgs {
    app: Application
}

export const startHttpServer = ({app}: startHttpServerArgs): Server => {
    return createServer(app);
}