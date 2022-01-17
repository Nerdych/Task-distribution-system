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
import {OrganizationRole} from "../models/OrganizationRole";
import {OrganizationRight} from "../models/OrganizationRight";
import {OrganizationRoleOrganizationRight} from "../models/OrganizationRoleOrganizationRight";
import {LabelCard} from "../models/LabelCard";
import {UserLabel} from "../models/UserLabel";
import {UserOrganizationRole} from "../models/UserOrganizationRole";
import {UserDesk} from "../models/UserDesk";
import {UserOrganization} from "../models/UserOrganization";
import {Message} from "../models/Message";

export const db: Sequelize = new Sequelize({
    database: dbConfig.database,
    username: dbConfig.username,
    password: dbConfig.password,
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    models: [User, Organization, Desk, ColumnTable, Card, List, Task, Comment, Label, OrganizationRole, OrganizationRight, OrganizationRoleOrganizationRight, LabelCard, UserLabel, UserOrganizationRole, UserDesk, UserOrganization, Message],
});
