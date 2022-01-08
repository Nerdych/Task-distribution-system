// Core
import {gql} from 'apollo-server-express';

export const schema = gql`
    type Query {
        getUser: String
    }
`;
