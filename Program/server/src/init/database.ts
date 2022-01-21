// Core
import {Sequelize} from 'sequelize-typescript';

// Config Database
import {dbConfig} from './config/dbConfig';

// Models
import {Card} from '../models/Card';
import {ColumnTable} from '../models/Column';
import {Comment} from "../models/Comment";
import {Desk} from '../models/Desk';
import {Label} from "../models/Label";
import {LabelCard} from "../models/LabelCard";
import {List} from '../models/List';
import {Message} from "../models/Message";
import {Organization} from '../models/Ogranization';
import {Purpose} from "../models/Purpose";
import {Right} from "../models/Right";
import {Role} from "../models/Role";
import {RoleRight} from "../models/RoleRight";
import {Task} from '../models/Task';
import {User} from '../models/User';
import {UserDesk} from "../models/UserDesk";
import {UserDeskRole} from "../models/UserDeskRole";
import {UserLabel} from "../models/UserLabel";
import {UserOrganization} from "../models/UserOrganization";
import {UserOrganizationRole} from "../models/UserOrganizationRole";
import {Action} from "../models/Action";
import {BeginCondition} from "../models/BeginCondition";
import {BeginConditionRight} from "../models/BeginConditionRight";
import {ObjectTable} from "../models/Object";

export const db: Sequelize = new Sequelize({
    database: dbConfig.database,
    username: dbConfig.username,
    password: dbConfig.password,
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    models: [User, Organization, Desk, ColumnTable, Card, List, Task, Comment, Label, Role, Right, LabelCard, UserLabel, UserOrganizationRole, UserDesk, UserOrganization, Message, Purpose, RoleRight, UserDeskRole, Action, BeginCondition, BeginConditionRight, ObjectTable],
});
