// Core
import express from 'express';
import cors from 'cors';

// Config
import {corsConfig} from './init/config/corsConfig';
import {PORT} from './init/config/constants';

// Database
import {db} from './init/database';

// Server
import {apolloServer, app} from './init/server';

import {User} from './models/User';
import {Desk} from './models/Desk';
import {Organization} from './models/Ogranization';
import {ColumnTable} from './models/Column';
import {Card} from './models/Card';
import {Comment} from "./models/Comment";
import {Label} from "./models/Label";
import {Role} from "./models/Role";
import {Right} from "./models/Right";
import {RoleRight} from "./models/RoleRight";
import {Message} from "./models/Message";

const start = async () => {
    try {
        await db
            .authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });

        await apolloServer.start();
        apolloServer.applyMiddleware({app});

        app.use(cors(corsConfig));
        // parse requests of content-type - application/json
        app.use(express.json());
        // parse requests of content-type - application/x-www-form-urlencoded
        app.use(express.urlencoded({extended: true}));

        // await Message.create({text: 'Сообщение ЗДАРВОА ТВАРЫНА', user_id: 1, date_of_create: new Date(), desk_id: 3});
        //
        // app.use('/api', (_, res) => {
        //     Desk.findAll({include: [{model: Message}], where: {id: 1}}).then(users => {
        //         res.send(users);
        //     });
        // });

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (err) {
        console.error(err);
    }
};

start();
