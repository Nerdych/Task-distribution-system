// Core
import {Sequelize} from 'sequelize-typescript';

// Config Database
import {dbConfig} from './config/dbConfig';

// Models
import {Desk} from '../models/Desk';
import {Organization} from '../models/Ogranization';
import {User} from '../models/User';
import {ColumnTable} from '../models/Column';
import {Card} from '../models/Card';
import {List} from '../models/List';
import {Task} from '../models/Task';
import {Comment} from "../models/Comment";
import {Label} from "../models/Label";
import {Role} from "../models/Role";
import {Right} from "../models/Right";
import {RoleRight} from "../models/RoleRight";
import {LabelCard} from "../models/LabelCard";
import {UserLabel} from "../models/UserLabel";
import {UserRole} from "../models/UserRole";
import {UserDesk} from "../models/UserDesk";
import {UserOrganization} from "../models/UserOrganization";
import {Message} from "../models/Message";

export const db: Sequelize = new Sequelize({
    database: dbConfig.DB,
    username: dbConfig.USERNAME,
    password: dbConfig.PASSWORD,
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    models: [User, Organization, Desk, ColumnTable, Card, List, Task, Comment, Label, Role, Right, RoleRight, LabelCard, UserLabel, UserRole, UserDesk, UserOrganization, Message],
});
