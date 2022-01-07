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
import {Organization} from './models/Ogranization';
import {Desk} from './models/Desk';
import {ColumnTable} from './models/Column';
import {Card} from './models/Card';

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

        // Card.create({ name: 'first card', column_id: 1, user_id: 1 });

        app.use('/api', (_, res) => {
            Card.findAll({include: [{model: User}, {model: ColumnTable}]}).then(users => {
                res.send(users);
            });
        });

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (err) {
        console.error(err);
    }
};

start();
